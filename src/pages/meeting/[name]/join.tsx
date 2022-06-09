import { Box, HStack, Text, StackDivider, Skeleton } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { getRoomByTitleQuery } from 'queries/room'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
	useDaily,
	useLocalParticipant,
	useParticipantIds,
	useVideoTrack,
	useScreenShare,
} from '@daily-co/daily-react-hooks'
import Tile from 'components/room/Tile'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs'
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md'
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri'
import { IoExitOutline } from 'react-icons/io5'
import { ButtonRoom } from 'components/room'

export default function join() {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { name } = router.query
	const [isFullScreen, setIsFullScreen] = useState(false)

	// state
	const [tiles, setTiles] = useState<
		{
			id: string
			isCurrentUser: boolean
		}[]
	>([])
	const [skeletons] = useState([1, 2, 3, 4, 5])

	// query
	const { data: dataRoom } = getRoomByTitleQuery(isAuthenticated, name)

	const co = useDaily()

	const { screens, isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare()
	// get all id of participant
	const remoteParticipantIds = useParticipantIds({ filter: 'remote' })

	/* This is for displaying our self-view. */
	const localParticipant = useLocalParticipant()
	const localParticipantVideoTrack = useVideoTrack(localParticipant?.session_id)
	const localVideoElement = useRef<any>(null)
	//get MediaStream of current user
	useEffect(() => {
		if (!localParticipantVideoTrack.persistentTrack) return
		localVideoElement?.current &&
			(localVideoElement.current.srcObject =
				localParticipantVideoTrack.persistentTrack &&
				new MediaStream([localParticipantVideoTrack?.persistentTrack]))
	}, [localParticipantVideoTrack.persistentTrack])

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
		if(document.fullscreenElement ) {
			document.exitFullscreen()
			setIsFullScreen(false)
		} else {
			setIsFullScreen(true)
			document.documentElement.requestFullscreen().catch(()=> {
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
						{tiles.map((tile, key) => (
							<Tile
								id={tile.id}
								key={key}
								isCurrentUser={tile.isCurrentUser}
							/>
						))}
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
					<Box paddingInline={'10px'} w={'full'} h={'calc( 100% - 100px )'}>
						<Box
							background={localParticipant ? '#000000' : '#222222'}
							w={'full'}
							h={'100%'}
							borderRadius={'15px'}
							border="2px solid"
							borderColor={'hu-Green.normal'}
							overflow={'hidden'}
						>
							{screens.length > 0 ? (
								<Tile
									id={screens[screens.length - 1].session_id}
									screenShare={true}
									isCurrentUser={true}
									isCenter={true}
								/>
							) : (
								localParticipant && (
									<Tile
										id={localParticipant.session_id}
										isCurrentUser={true}
										isCenter={true}
									/>
								)
							)}
						</Box>
					</Box>
					<Box paddingInline={3} w={'full'} height={'120px'} mt={'30px'}>
						<HStack
							w={'full'}
							h={'100%'}
							borderTop={'2px solid'}
							borderColor={'gray'}
							justifyContent={'space-between'}
						>
							<Box>1</Box>
							<HStack spacing={5}>
								<ButtonRoom
									title="Mic"
									handle={() => {
										if (co) {
											const isUseAudio = co.localAudio()
											co.setLocalAudio(!isUseAudio)
										}
									}}
									isDisabled={co?.localAudio()}
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
									isDisabled={co?.localVideo()}
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
									isDisabled={isSharingScreen}
									iconClose={<MdOutlineStopScreenShare />}
									iconOpen={<MdOutlineScreenShare />}
								/>

								<ButtonRoom
									title="Screen"
									handle={() => {
										toggleFullScreen()
									}}
									isDisabled={isFullScreen ? true: false}
									iconClose={<RiFullscreenExitLine />}
									iconOpen={<RiFullscreenFill />}
								/>
							</HStack>
							// leave

							<ButtonRoom
									title="Leave"
									handle={() => {
										if (co) {
											co.leave()
											router.push('/')
										}
									}}
									isDisabled={false}
									iconClose={<IoExitOutline />}
									iconOpen={<IoExitOutline />}
								/>
							
						</HStack>
					</Box>
				</Box>
				<Box pt={8} pb={9} w={'300px'} h={'100%'} minW={'300px'}>
					<Box w={'full'} h={'100%'} bg={'#2b2d2e'} borderRadius={15}></Box>
				</Box>
			</HStack>
		</Box>
	)
}
