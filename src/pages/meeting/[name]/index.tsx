import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	HStack,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { getRoomByTitleQuery } from 'queries/room'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDaily, useLocalParticipant, useVideoTrack } from '@daily-co/daily-react-hooks'
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs'
import Link from 'next/link'
import { ImMagicWand } from 'react-icons/im'
import { Await } from 'components/room'
import Modal from 'components/modal/Modal'
import Tile from 'components/room/Tile'
import { MdLensBlur } from 'react-icons/md'
import { backgroundBlur, backgroundImage, backgroundNone } from 'utils/RoomUtils'
import { FiXCircle } from 'react-icons/fi'
import { createClient, PhotosWithTotalResults } from 'pexels'
import Head from 'next/head'

export default function index() {
	const { colorMode, toggleColorMode } = useColorMode()

	const { isOpen, onOpen, onClose } = useDisclosure()
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { name } = router.query

	// get image
	const [backgrounds, setBackgrounds] = useState<string[] | undefined>([])
	const [query, setQuery] = useState('room')
	const pexel = createClient('563492ad6f91700001000001b7637a3e86ad4b63a805ed7d7d7be975')
	const [isLoadding, setIsLoadding] = useState(true)
	const { search } = pexel.photos

	useEffect(() => {
		if (colorMode == 'dark') {
			toggleColorMode()
		}
	}, [colorMode])
	useEffect(() => {
		search({
			page: 1,
			query,
			per_page: 10,
		}).then((result: any) => {
			const data = result.photos.map(
				(e: {
					src: {
						original: string
					}
				}) => {
					return e.src.original
				}
			)
			setBackgrounds(data)
			setIsLoadding(false)
		})
	}, [])

	const getBgs = async () => {
		if (!query) {
			setToast({
				msg: 'Please enter query',
				type: 'error',
			})
			return
		}
		setIsLoadding(true)
		const result = (await search({
			page: 1,
			query,
			per_page: 10,
		})) as PhotosWithTotalResults

		const data = result.photos.map((e) => {
			return e.src.original
		})
		setBackgrounds(data)
		setIsLoadding(false)
	}

	const co = useDaily()

	/* This is for displaying our self-view. */
	const localParticipant = useLocalParticipant()
	const localParticipantVideoTrack = useVideoTrack(localParticipant?.session_id || ' ')
	const localVideoElement = useRef<any>(null)

	// query
	const { data: dataRoom } = getRoomByTitleQuery(isAuthenticated, name)

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

	// start camera and audio
	useEffect(() => {
		if (co && dataRoom?.room) {
			if (
				new Date(
					`${new Date(dataRoom.room.date).getMonth() + 1}-${new Date(
						dataRoom.room.date
					).getDate()}-${new Date(dataRoom.room.date).getFullYear()} ${
						dataRoom.room.start_time
					}`
				).getTime() <= new Date().getTime()
			) {
				co.startCamera()
			}
		}
	}, [co, dataRoom])

	useEffect(() => {
		if (localParticipantVideoTrack) {
			if (!localParticipantVideoTrack.persistentTrack) return
			localVideoElement?.current &&
				(localVideoElement.current.srcObject =
					localParticipantVideoTrack.persistentTrack &&
					new MediaStream([localParticipantVideoTrack?.persistentTrack]))
		}
	}, [localParticipantVideoTrack])

	return (
		<Box boxSizing="border-box" padding={5} w={'full'} h={'96vh'}>
			<Head>
				<title>Huprom - {name} meeting</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<HStack alignItems={'center'} justifyContent={'space-between'}>
				<Box border={'1px solid red'} w={'50px'} h={'50px'}></Box>
				{currentUser && (
					<HStack spacing={5}>
						<Box>
							<Text dir="rtl">{currentUser.email}</Text>
							<Text color={'gray'} fontSize={'14px'} dir="rtl">
								{currentUser.role}
							</Text>
						</Box>
						<Avatar size={'md'} name={currentUser.name} src={currentUser.avatar?.url} />
					</HStack>
				)}
			</HStack>
			{dataRoom?.room ? (
				<>
					{new Date(
						`${new Date(dataRoom.room.date).getMonth() + 1}-${new Date(
							dataRoom.room.date
						).getDate()}-${new Date(dataRoom.room.date).getFullYear()} ${
							dataRoom.room.start_time
						}`
					).getTime() >= new Date().getTime() ? (
						<Await room={dataRoom.room} />
					) : (
						<HStack
							justifyContent={'center'}
							alignItems={'center'}
							w={'full'}
							h={'100%'}
							flexDir={'row'}
							spacing={10}
						>
							<VStack
								justifyContent={'center'}
								alignItems={'center'}
								w={'100%'}
								h={'full'}
								maxW={'700px'}
								spacing={5}
							>
								<Box
									w={'100%'}
									border={'3px solid'}
									borderColor={'hu-Green.normalH'}
									background={'#000000'}
									borderRadius={15}
									overflow={'hidden'}
									maxH={'390px'}
									h={'full'}
								>
									{localParticipant && (
										<video
											style={{
												width: '100%',
												height: '100%',
											}}
											autoPlay
											muted
											playsInline
											ref={localVideoElement}
										/>
									)}
								</Box>
								<HStack spacing={5}>
									<VStack>
										<IconButton
											onClick={() => {
												if (co) {
													const isUseAudio = co.localAudio()
													co.setLocalAudio(!isUseAudio)
												}
											}}
											variant={'outline'}
											colorScheme={co?.localAudio() ? 'green' : 'gray'}
											aria-label="mic"
											icon={
												co?.localAudio() ? (
													<BiMicrophone />
												) : (
													<BiMicrophoneOff />
												)
											}
										/>
										<Text>Mic</Text>
									</VStack>
									<VStack>
										<IconButton
											onClick={() => {
												if (co) {
													const isUseVideo = co.localVideo()
													co.setLocalVideo(!isUseVideo)
												}
											}}
											variant={'outline'}
											colorScheme={co?.localVideo() ? 'green' : 'gray'}
											aria-label="cam"
											icon={
												co?.localVideo() ? (
													<BsCameraVideo />
												) : (
													<BsCameraVideoOff />
												)
											}
										/>
										<Text>Cam</Text>
									</VStack>
									<VStack>
										<IconButton
											onClick={onOpen}
											variant={'outline'}
											colorScheme={'gray'}
											aria-label="Magic"
											icon={<ImMagicWand />}
										/>
										<Text>Magic</Text>
									</VStack>
								</HStack>
							</VStack>
							<Box width={'max-content'} maxW={'400px'}>
								{dataRoom?.room && (
									<VStack
										paddingBottom={'70px'}
										alignItems={'start'}
										w={'full'}
										spacing={2}
									>
										<AvatarGroup size={'sm'} max={5}>
											{dataRoom.room?.employees.map((empl, key) => (
												<Avatar
													key={key}
													name={empl.name}
													src={empl.avatar?.url}
												/>
											))}
											{dataRoom.room?.clients.map((client, key) => (
												<Avatar
													key={key}
													name={client.name}
													src={client.avatar?.url}
												/>
											))}
										</AvatarGroup>
										<Box>
											<Text fontWeight={'bold'} fontSize={'2xl'}>
												{dataRoom?.room?.title.replace(/-/g, ' ')}
											</Text>
											<Text color={'gray'} fontSize={'lg'}>
												{dataRoom.room?.description}
											</Text>
										</Box>
										<Link href={`/meeting/${name}/join`}>
											<Button colorScheme={'green'} mt={'10px !important'}>
												Join room
											</Button>
										</Link>
									</VStack>
								)}
							</Box>
						</HStack>
					)}
				</>
			) : (
				<Loading />
			)}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				onOpen={onOpen}
				title={'Config meeting'}
				isFooter={false}
				size="6xl"
			>
				<Tabs paddingInline={6} isFitted>
					<TabList>
						<Tab>Magic</Tab>
						<Tab>Volume and video</Tab>
					</TabList>

					<TabPanels>
						<TabPanel pt={'20px!important'} paddingInline={'0px!important'}>
							<HStack h={'500px'} spacing={5}>
								<Box
									w={'100%'}
									border={'3px solid'}
									borderColor={'hu-Green.normalH'}
									background={'#000000'}
									borderRadius={15}
									overflow={'hidden'}
									h={'100%'}
									flex={1}
								>
									{localParticipant && (
										<Tile
											id={localParticipant.session_id}
											isCurrentUser={true}
											isCenter={true}
										/>
									)}
								</Box>
								<VStack spacing={5} alignItems="start" h={'100%'} w={'300px'}>
									<VStack w={'full'} alignItems={'start'} spacing={4}>
										<Text fontWeight={'semibold'} fontSize={'lg'}>
											Remove effects and blur
										</Text>
										<HStack spacing={4}>
											<VStack>
												<IconButton
													onClick={() => {
														backgroundNone(co)
													}}
													variant={'outline'}
													colorScheme={'gray'}
													aria-label="Magic"
													icon={<FiXCircle />}
												/>
												<Text>None</Text>
											</VStack>
											<VStack>
												<IconButton
													onClick={() => {
														backgroundBlur(0.5, co)
													}}
													variant={'outline'}
													colorScheme={'gray'}
													aria-label="Magic"
													icon={<MdLensBlur />}
												/>
												<Text>Blur</Text>
											</VStack>
											<VStack>
												<IconButton
													onClick={() => {
														backgroundBlur(1, co)
													}}
													variant={'outline'}
													colorScheme={'gray'}
													aria-label="Magic"
													icon={<MdLensBlur fontSize={'20px'} />}
												/>
												<Text>Blur</Text>
											</VStack>
										</HStack>
									</VStack>

									<VStack
										w={'full'}
										h={'73%'}
										pos={'relative'}
										alignItems={'start'}
										spacing={4}
									>
										<Text fontWeight={'semibold'} fontSize={'lg'}>
											Background
										</Text>

										<InputGroup size="md">
											<Input
												value={query}
												onChange={(e) => setQuery(e.target.value)}
												pr="4.5rem"
												placeholder="Enter name"
											/>
											<InputRightElement width="4.5rem">
												<Button
													h="1.75rem"
													size="md"
													marginRight={'8px'}
													onClick={getBgs}
												>
													Show
												</Button>
											</InputRightElement>
										</InputGroup>

										<VStack flex={1} w={'full'} spacing={4} overflow={'auto'}>
											{backgrounds &&
												backgrounds.map((bg, index) => (
													<Box
														userSelect={'none'}
														cursor={'pointer'}
														onClick={() => {
															backgroundImage(bg, co)
														}}
														w={'full'}
														height={'max-content'}
														pos={'relative'}
													>
														<Image
															loading="lazy"
															borderRadius={10}
															border={'3px solid'}
															borderColor={'hu-Lam.normal'}
															w={'full'}
															src={bg}
															key={index}
														/>
													</Box>
												))}
											{isLoadding && <Loading />}
										</VStack>
									</VStack>
								</VStack>
							</HStack>
						</TabPanel>
						<TabPanel>
							<p>two!</p>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Modal>
		</Box>
	)
}
