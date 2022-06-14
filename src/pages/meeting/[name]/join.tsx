import {
	Box,
	HStack,
	Text,
	StackDivider,
	Skeleton,
	Button,
	VStack,
	useDisclosure,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { getRoomByTitleQuery } from 'queries/room'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
	useAppMessage,
	useDaily,
	useLocalParticipant,
	useParticipantIds,
	useScreenShare,
} from '@daily-co/daily-react-hooks'
import Tile from 'components/room/Tile'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { BiLinkAlt, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs'
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md'
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri'
import { IoExitOutline } from 'react-icons/io5'
import { ButtonRoom, MessageBar, Participant, Setting } from 'components/room'
import { DailyEventObjectAppMessage } from '@daily-co/daily-js'
import { ImessageRoom } from 'type/basicTypes'
import copy from 'copy-to-clipboard'
import { AiOutlineSetting, AiTwotoneSetting } from 'react-icons/ai'

export default function join() {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { name } = router.query
	const { isOpen, onOpen, onClose } = useDisclosure()

	// query
	const { data: dataRoom } = getRoomByTitleQuery(isAuthenticated, name)
	// state
	const [tiles, setTiles] = useState<
		{
			id: string
			isCurrentUser: boolean
		}[]
	>([])
	const [skeletons] = useState([1, 2, 3, 4, 5])
	const [msgs, setMsgs] = useState<ImessageRoom[]>([])
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [isShowMsgBar, setIsShowMsgBar] = useState(true)

	// admin can config your volume and video
	const [config, setConfig] = useState<{
		peerId?: string
		field: string
		isField: boolean
	}>()

	// set is for screen, audio or screen of people in room
	const [isScreen, setIsScreen] = useState(true)
	const [isAudio, setIsAudio] = useState(true)
	const [isVideo, setIsVideo] = useState(true)
	const [isSendMsg, setIsSendMsg] = useState(true)

	// this is for current user
	const [isYourScreen, setIsYourScreen] = useState(true)
	const [isYourAudio, setIsYourAudio] = useState(true)
	const [isYourVideo, setIsYourVideo] = useState(true)
	const [isYourMsg, setIsYourMsg] = useState(true)

	// share screen
	const [idScreen, setIdScreen] = useState<string>()
	const [idScreens, setIdScreens] = useState<string[]>([])

	// pin participant
	const [pinId, setPinId] = useState<string>()

	const co = useDaily()

	const { screens, isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare()

	// get all id of participant
	const remoteParticipantIds = useParticipantIds({ filter: 'remote' })

	/* This is for displaying our self-view. */
	const localParticipant = useLocalParticipant()

	// send message
	const sendAppMessage = useAppMessage({
		onAppMessage: useCallback((ev: DailyEventObjectAppMessage<ImessageRoom>) => {
			if (ev.data.field) {
				if (ev.data.isField != undefined) {
					if (ev.data.peerId == '*') {
						if (ev.data.field.includes('screen'))
							return setIsYourScreen(ev.data.isField)
						if (ev.data.field.includes('audio')) return setIsYourAudio(ev.data.isField)
						if (ev.data.field.includes('video')) return setIsYourVideo(ev.data.isField)
						if (ev.data.field.includes('msg')) return setIsYourMsg(ev.data.isField)
					} else {
						setConfig({
							field: ev.data.field,
							isField: ev.data.isField,
							peerId: ev.data.peerId,
						})
					}
				}
			} else {
				setMsgs((m) => [...m, ev.data])
			}
		}, []),
	})

	const handleSendMsg = async ({
		text,
		field,
		isField,
		peerId,
	}: {
		text?: string
		field?: string
		isField?: boolean
		peerId?: string
	}) => {
		const date = new Date()
		if (currentUser) {
			const data = {
				name: currentUser?.name,
				time: `${date.getHours()}:${date.getMinutes()}`,
				id: currentUser.id,
				text,
				field,
				isField,
				peerId,
			}
			sendAppMessage(data, '*')
			if (!field) {
				setMsgs((state) => [...state, data])
			}
		}
	}

	useEffect(() => {
		if (!isYourScreen) {
			stopScreenShare()
		}
	}, [isYourScreen])
	useEffect(() => {
		if (!isYourAudio) {
			co?.setLocalAudio(isYourAudio)
		}
	}, [isYourAudio])
	useEffect(() => {
		if (!isYourVideo) {
			co?.setLocalVideo(isYourVideo)
		}
	}, [isYourVideo])

	useEffect(() => {
		if (co?.meetingState() == 'joined-meeting') {
			handleSendMsg({
				field: 'screen',
				isField: isScreen,
				peerId: '*',
			})
		}
	}, [isScreen])
	useEffect(() => {
		if (co?.meetingState() == 'joined-meeting') {
			handleSendMsg({
				field: 'audio',
				isField: isAudio,
				peerId: '*',
			})
		}
	}, [isAudio])
	useEffect(() => {
		if (co?.meetingState() == 'joined-meeting') {
			handleSendMsg({
				field: 'video',
				isField: isVideo,
				peerId: '*',
			})
		}
	}, [isVideo])
	useEffect(() => {
		if (co?.meetingState() == 'joined-meeting') {
			handleSendMsg({
				field: 'msg',
				isField: isSendMsg,
				peerId: '*',
			})
		}
	}, [isSendMsg])

	useEffect(() => {
		if (config && localParticipant && co) {
			if (config.peerId?.includes(localParticipant.session_id)) {
				if (config.field.includes('video')) {
					co.setLocalVideo(false)
				}
				if (config.field.includes('audio')) {
					co.setLocalAudio(false)
				}
			}
		}
	}, [config])

	// set all id of participants
	useEffect(() => {
		const data: { id: string; isCurrentUser: boolean }[] = []
		if (localParticipant) {
			data.push({
				id: localParticipant.session_id,
				isCurrentUser: true,
			})
		}
		if (remoteParticipantIds) {
			remoteParticipantIds.map((id) => {
				data.push({
					id,
					isCurrentUser: false,
				})
			})
		}
		setTiles(data)
	}, [localParticipant, remoteParticipantIds])

	//User effect ---------------------------------------------------------------
	// check authenticate in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (name && currentUser && co) {
			co.join({
				userName: currentUser.name,
				url: `${process.env.NEXT_PUBLIC_ZOOM_URL_JOIN}/${name}`,
			})
		}
	}, [name, currentUser, co])

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 5,
		initialSlide: 0,
		arrows: false,
		vertical: true,
		verticalSwiping: true,
	}

	const toggleFullScreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen()
			setIsFullScreen(false)
		} else {
			setIsFullScreen(true)
			document.documentElement.requestFullscreen().catch(() => {
				alert('loi roi nha')
			})
		}
	}

	return (
		<Box bg={'#1b1a1d'} pos={'relative'} w={'100%'} h={'100vh'}>
			<HStack
				borderBottom={'1px solid'}
				borderColor={'gray'}
				padding={6}
				alignItems={'center'}
				justifyContent={'space-between'}
			>
				<HStack spacing={5} divider={<StackDivider borderColor="gray" />}>
					<HStack spacing={5}>
						<Box border={'1px solid red'} w={'50px'} h={'50px'}></Box>
						<Text fontWeight={'semibold'} fontSize={'xl'} color={'white'}>
							HUPROM
						</Text>
					</HStack>
					<Text fontSize={'xl'} color={'white'}>
						{dataRoom?.room?.title.replace(/-/g, ' ')}
					</Text>
				</HStack>
			</HStack>

			<HStack
				id={'meeting'}
				paddingInline={6}
				alignItems={'start'}
				spacing={5}
				w={'full'}
				pos={'relative'}
				height={'calc( 100% - 100px )'}
			>
				<Box height={'100%'} paddingBlock={5} w={'300px'} pos={'relative'}>
					<Slider {...settings}>
						{tiles.map((tile, key) => {
							return (
								<Tile
									isTalking={co?.getActiveSpeaker().peerId == tile.id}
									id={tile.id}
									key={key}
									isCurrentUser={tile.isCurrentUser}
								/>
							)
						})}
						{tiles &&
							skeletons.length > tiles.length &&
							skeletons.map((_, key) => {
								if (skeletons.length - tiles.length >= key + 1) {
									return (
										<Box
											as="div"
											paddingBlock={'10px'}
											h={'full'}
											height={'170px'}
											key={key}
										>
											<Skeleton
												fadeDuration={0.5}
												startColor="#222222"
												endColor="#22222240"
												w={'full'}
												h={'100%'}
												borderRadius={'15px'}
												overflow={'hidden'}
											></Skeleton>
										</Box>
									)
								}
								return
							})}
					</Slider>
				</Box>
				<Box pt={8} minW={'300px'} flex={1} pos={'relative'} height={'calc( 100% - 50px )'}>
					<Box paddingInline={'10px'} w={'full'} h={'calc( 100% - 110px )'}>
						<Box
							background={localParticipant ? '#000000' : '#222222'}
							w={'full'}
							h={'100%'}
							borderRadius={'15px'}
							border="2px solid"
							borderColor={'hu-Green.normal'}
							overflow={'hidden'}
						>
							{screens.length != 0 && !pinId && (
								<Tile
									id={screens[screens.length - 1].session_id}
									screenShare={true}
									isCurrentUser={true}
									isCenter={true}
								/>
							)}

							{co?.getActiveSpeaker().peerId && screens.length == 0 && !pinId && (
								<Tile
									id={co.getActiveSpeaker().peerId as string}
									isCurrentUser={true}
									isCenter={true}
								/>
							)}

							{pinId && <Tile id={pinId} isCurrentUser={true} isCenter={true} />}
						</Box>
					</Box>
					<Box paddingInline={3} w={'full'} height={'120px'} mt={'30px'}>
						<HStack
							w={'full'}
							pt={'25px'}
							h={'100%'}
							borderTop={'2px solid'}
							borderColor={'gray'}
							justifyContent={'space-between'}
							alignItems={'start'}
						>
							<ButtonRoom
								title="Link"
								handle={() => {
									copy(`${process.env.NEXT_PUBLIC_UI_URL}/meeting/${name}`)
									setToast({
										type: 'success',
										msg: 'Copy link successfully',
									})
								}}
								isClose={false}
								iconClose={<BiLinkAlt />}
								iconOpen={<BiLinkAlt />}
							/>
							<HStack spacing={5}>
								<ButtonRoom
									title="Mic"
									handle={() => {
										if (co) {
											const isUseAudio = co.localAudio()
											co.setLocalAudio(!isUseAudio)
										}
									}}
									isDisabled={!isYourAudio}
									isClose={co?.localAudio()}
									iconClose={<BiMicrophoneOff />}
									iconOpen={<BiMicrophone />}
								/>

								<ButtonRoom
									title="Cam"
									handle={() => {
										if (co) {
											const isUseVideo = co.localVideo()
											co.setLocalVideo(!isUseVideo)
										}
									}}
									isDisabled={!isYourVideo}
									isClose={co?.localVideo()}
									iconClose={<BsCameraVideoOff />}
									iconOpen={<BsCameraVideo />}
								/>

								<ButtonRoom
									title="Share"
									handle={() => {
										if (isSharingScreen) {
											stopScreenShare()
										} else {
											startScreenShare()
										}
									}}
									isDisabled={!isYourScreen}
									isClose={isSharingScreen}
									iconClose={<MdOutlineStopScreenShare />}
									iconOpen={<MdOutlineScreenShare />}
								/>

								<ButtonRoom
									title="Screen"
									handle={() => {
										toggleFullScreen()
									}}
									isClose={isFullScreen ? true : false}
									iconClose={<RiFullscreenExitLine />}
									iconOpen={<RiFullscreenFill />}
								/>
								{dataRoom?.room?.empl_create.email == currentUser?.email && (
									<ButtonRoom
										title="Set"
										handle={() => {
											onOpen()
										}}
										isClose={isOpen ? true : false}
										iconClose={<AiOutlineSetting />}
										iconOpen={<AiTwotoneSetting />}
									/>
								)}
							</HStack>
							{/* leave */}
							<ButtonRoom
								title="Leave"
								handle={() => {
									if (co) {
										co.leave()
										handleLoading(true)
										router.push('/')
									}
								}}
								isClose={false}
								iconClose={<IoExitOutline />}
								iconOpen={<IoExitOutline />}
							/>
						</HStack>
					</Box>
				</Box>
				<Box pt={8} pb={9} w={'350px'} h={'100%'} minW={'300px'}>
					<VStack
						alignItems={'start'}
						justifyContent={'start'}
						spacing={5}
						paddingBlock={4}
						w={'full'}
						h={'100%'}
						bg={'#2b2d2e'}
						borderRadius={15}
					>
						<Box paddingInline={4} w={'full'}>
							<HStack
								borderRadius={'10px'}
								p={2}
								spacing={4}
								h={'50px'}
								w={'full'}
								bg={'rgba(225,225,225,0.1)'}
							>
								<Button
									onClick={() => setIsShowMsgBar(true)}
									_hover={{
										color: 'black',
										bg: 'hu-Green.normal',
									}}
									w={'full'}
									bg={isShowMsgBar ? 'hu-Green.lightA' : ''}
									variant={isShowMsgBar ? 'solid' : 'ghost'}
									color={isShowMsgBar ? 'black' : 'white'}
									fontWeight={!isShowMsgBar ? 'normal' : 'semibold'}
								>
									Messages ({msgs.length})
								</Button>
								<Button
									onClick={() => setIsShowMsgBar(false)}
									_hover={{
										color: 'black',
										bg: 'hu-Green.normal',
									}}
									w={'full'}
									fontWeight={isShowMsgBar ? 'normal' : 'semibold'}
									bg={!isShowMsgBar ? 'hu-Green.lightA' : ''}
									variant={!isShowMsgBar ? 'solid' : 'ghost'}
									color={!isShowMsgBar ? 'black' : 'white'}
								>
									Participant ({co?.participantCounts().present})
								</Button>
							</HStack>
						</Box>
						{isShowMsgBar ? (
							<MessageBar
								isDisabled={!isYourMsg}
								msgs={msgs}
								handleSendMsg={handleSendMsg}
							/>
						) : (
							<VStack
								alignItems={'start'}
								w={'full'}
								overflow={'auto'}
								h={'100%'}
								spacing={5}
								paddingInline={4}
							>
								{tiles.map((tile, key) => (
									<Participant
										id={tile.id}
										key={key}
										localId={localParticipant?.user_id}
										handleSendMsg={handleSendMsg}
										setPinId={setPinId}
										pinId={pinId}
									/>
								))}
							</VStack>
						)}
					</VStack>
				</Box>
			</HStack>
			<Setting
				isAudio={isAudio}
				setIsAudio={setIsAudio}
				isSendMsg={isSendMsg}
				isScreen={isScreen}
				isVideo={isVideo}
				isOpen={isOpen}
				onClose={onClose}
				setIsScreen={setIsScreen}
				setIsSendMsg={setIsSendMsg}
				setIsVideo={setIsVideo}
			/>
		</Box>
	)
}
