import {
	Box,
	HStack,
	Text,
	StackDivider,
	Skeleton,
	useDisclosure,
	useBreakpoint,
	useColorMode,
	Stack,
	MenuButton,
	MenuList,
	MenuItem,
	Menu,
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
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { BiLinkAlt, BiMessageDetail, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { BsCameraVideo, BsCameraVideoOff, BsPeople } from 'react-icons/bs'
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md'
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri'
import { IoExitOutline } from 'react-icons/io5'
import { ButtonRoom, LeftBar, Setting } from 'components/room'
import { DailyEventObjectAppMessage } from '@daily-co/daily-js'
import { ImessageRoom, ITile } from 'type/basicTypes'
import copy from 'copy-to-clipboard'
import { AiOutlineSetting, AiTwotoneSetting } from 'react-icons/ai'
import RightSide from 'components/room/RightSide'
import { ButtonMenu } from 'components/common'

export default function join() {
	const layoutSize = useBreakpoint()
	console.log(layoutSize)
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { name } = router.query

	const { toggleColorMode, colorMode } = useColorMode()

	// open to setting, only admin setting
	const { isOpen, onOpen, onClose } = useDisclosure()

	const {
		isOpen: isOpenRightBar,
		onOpen: onOpenRightBar,
		onClose: onCloseRightBar,
	} = useDisclosure()

	const {
		isOpen: isOpenLeftBar,
		onOpen: onOpenLeftBar,
		onClose: onCloseLeftBar,
	} = useDisclosure()

	// query
	const { data: dataRoom } = getRoomByTitleQuery(isAuthenticated, name)
	// state
	const [tiles, setTiles] = useState<ITile[]>([])
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
	// const [idScreen, setIdScreen] = useState<string>()
	// const [idScreens, setIdScreens] = useState<string[]>([])

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

	useEffect(() => {
		if (colorMode == 'dark') {
			toggleColorMode()
		}
	}, [colorMode])

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
				w={'full'}
			>
				<HStack w={'full'} spacing={5} divider={<StackDivider borderColor="gray" />}>
					<HStack spacing={5}>
						<Box border={'1px solid red'} w={'50px'} h={'50px'}></Box>
						<Text fontWeight={'semibold'} fontSize={'xl'} color={'white'}>
							HUPROM
						</Text>
					</HStack>
					<HStack
						overflow={'hidden'}
						paddingRight={3}
						flex={1}
						justifyContent={'space-between'}
					>
						<Text isTruncated fontSize={'xl'} color={'white'}>
							{dataRoom?.room?.title.replace(/-/g, ' ')}
						</Text>
						{!layoutSize?.includes('xl') && (
							<Menu>
								<MenuButton>
									<ButtonMenu dir={'end'} onOpenMenu={() => {}} />
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={onOpenRightBar}
										icon={<BiMessageDetail fontSize={'15px'} />}
									>
										Message & participant
									</MenuItem>
									{layoutSize == 'sm' && (
										<MenuItem
											onClick={onOpenLeftBar}
											icon={<BsPeople fontSize={'15px'} />}
										>
											Another
										</MenuItem>
									)}
									{layoutSize == 'base' && (
										<MenuItem
											onClick={onOpenLeftBar}
											icon={<BsPeople fontSize={'15px'} />}
										>
											Another
										</MenuItem>
									)}
								</MenuList>
							</Menu>
						)}
					</HStack>
				</HStack>
			</HStack>

			<Stack
				direction={
					!layoutSize?.includes('xl') && !layoutSize?.includes('lg') ? 'column' : 'row'
				}
				id={'meeting'}
				paddingInline={6}
				alignItems={'start'}
				spacing={5}
				w={'full'}
				pos={'relative'}
				height={'calc( 100% - 100px )'}
			>
				<LeftBar isOpen={isOpenLeftBar} onClose={onCloseLeftBar}>
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
										paddingBlock={['10px', null, '0px', '10px']}
										paddingInline={['10px', null, null, '0px']}
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
				</LeftBar>

				<Stack
				  alignItems={'start'}
				  justifyContent={'start'}
				  spacing={6}
				  direction={['row-reverse','row-reverse', 'column']}
					pt={[8, 8, '0px', 8]}
					pr={'10px'}
					pl={['0px', null, '10px', '0px']}
					minW={'300px'}
					w={'100%'}
					flex={1}
					pos={'relative'}
					height={'calc( 100% - 18px )'}
				>
					<Box
						paddingInline={['0px', null, null, '10px']}
						w={'full'}
						h={['calc( 100% - 30px )', 'calc( 100% - 30px )', 'calc( 100% - 150px )', 'calc( 100% - 110px )']}
						
					>
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
					<Box overflow={'auto'} paddingInline={[0, null, null, 3]} minW={'50px'}  w={['50px', '50px','full']} height={['calc( 100% - 30px )', null, '120px']} mt={'30px'}>
						<Stack
							direction={['column', 'column', 'row']}
							w={'full'}
							spacing={[5, null, 0]}
							pt={[null, null,'25px']}
							h={'100%'}
							borderTop={[null, null, '2px solid']}
							borderColor={'gray'}
							justifyContent={['start', null,'space-between']}
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
							<Stack direction={['column', 'column', 'row']} justifyContent={'start'} p={[0, null, 'auto']} alignItems={'start'} spacing={5}>
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
									title="Full"
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
							</Stack>
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
						</Stack>
					</Box>
				</Stack>
				<RightSide
					handleSendMsg={handleSendMsg}
					co={co}
					isShowMsgBar={isShowMsgBar}
					isYourMsg={isYourMsg}
					localParticipant={localParticipant}
					setPinId={setPinId}
					tiles={tiles}
					msgs={msgs}
					setIsShowMsgBar={setIsShowMsgBar}
					pinId={pinId}
					isOpen={isOpenRightBar}
					onClose={onCloseRightBar}
				/>
			</Stack>
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
