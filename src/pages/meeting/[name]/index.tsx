import {
	AspectRatio,
	Avatar,
	AvatarGroup,
	Box,
	Button,
	Center,
	HStack,
	IconButton,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react'
import { Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { getRoomByTitleQuery } from 'queries/room'
import React, { useContext, useEffect, useRef } from 'react'
import { useDaily, useLocalParticipant, useMediaTrack, useVideoTrack } from '@daily-co/daily-react-hooks'
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs'
import Link from 'next/link'

export default function join() {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { name } = router.query

	const co = useDaily()

	/* This is for displaying our self-view. */
	const localParticipant = useLocalParticipant()
	const localParticipantVideoTrack = useVideoTrack(localParticipant?.session_id)
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
				).getTime() >= new Date().getTime()
			) {
				co.startCamera()
			}
		}
	}, [co, dataRoom])

	useEffect(() => {
		if (!localParticipantVideoTrack.persistentTrack) return
		localVideoElement?.current &&
			(localVideoElement.current.srcObject =
				localParticipantVideoTrack.persistentTrack &&
				new MediaStream([localParticipantVideoTrack?.persistentTrack]))
	}, [localParticipantVideoTrack.persistentTrack])

	return (
		<Box boxSizing="border-box" padding={5} w={'full'} h={'96vh'}>
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
			{dataRoom?.room &&
			new Date(
				`${new Date(dataRoom.room.date).getMonth() + 1}-${new Date(
					dataRoom.room.date
				).getDate()}-${new Date(dataRoom.room.date).getFullYear()} ${
					dataRoom.room.start_time
				}`
			).getTime() <= new Date().getTime() ? (
				<Center w={'full'} h={'full'} display={'flex'} flexDir="column">
					<VStack w={'full'} maxW={'400px'} spacing={2}>
						<AvatarGroup size={'sm'} max={5}>
							{dataRoom.room?.employees.map((empl, key) => (
								<Avatar key={key} name={empl.name} src={empl.avatar?.url} />
							))}
							{dataRoom.room?.clients.map((client, key) => (
								<Avatar key={key} name={client.name} src={client.avatar?.url} />
							))}
						</AvatarGroup>
						<Box>
							<Text textAlign={'center'} fontWeight={'bold'} fontSize={'2xl'}>
								{dataRoom?.room?.title.replace(/-/g, ' ')}
							</Text>
							<Text textAlign={'center'} color={'gray'} fontSize={'lg'}>
								{dataRoom.room?.description} gsf esfwe we wer3w wef wf wwe we ewew
								we wewe{' '}
							</Text>
						</Box>
						<Box w={'200px'} height={'15px'} position={'relative'}>
							<Loading />
						</Box>
						<Box>
							<Text mb={'5px'} textAlign={'center'} fontSize={'lg'}>
								The meeting started on
							</Text>
							<Text textAlign={'center'} fontWeight={'bold'} fontSize={'3xl'}>
								{`${new Date(dataRoom.room.date).getDate()}-${
									new Date(dataRoom.room.date).getMonth() + 1
								}-${new Date(dataRoom.room.date).getFullYear()} ${
									dataRoom.room.start_time
								}`}
							</Text>
						</Box>
					</VStack>
				</Center>
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
									icon={co?.localAudio() ? <BiMicrophone /> : <BiMicrophoneOff />}
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
										co?.localVideo() ? <BsCameraVideo /> : <BsCameraVideoOff />
									}
								/>
								<Text>Cam</Text>
							</VStack>
						</HStack>
					</VStack>
					<Box width={'max-content'} maxW={'400px'}>
						{dataRoom?.room && (
							<VStack paddingBottom={'70px'} alignItems={'start'} w={'full'} spacing={2}>
								<AvatarGroup size={'sm'} max={5}>
									{dataRoom.room?.employees.map((empl, key) => (
										<Avatar key={key} name={empl.name} src={empl.avatar?.url} />
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
										{dataRoom.room?.description} gsf esfwe we wer3w wef wf wwe
										we ewew we wewe{' '}
									</Text>
								</Box>
								<Link href={`/meeting/${name}/join`}>
									<Button colorScheme={'green'} mt={'10px !important'}>Join room</Button>
								</Link>
							</VStack>
						)}
					</Box>
				</HStack>
			)}
		</Box>
	)
}
