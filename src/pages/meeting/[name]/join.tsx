import { Box, HStack, Text, StackDivider, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { getRoomByTitleQuery } from 'queries/room'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Swiper } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import {
	useDaily,
	useLocalParticipant,
	useParticipantIds,
	useVideoTrack,
} from '@daily-co/daily-react-hooks'
import Tile from 'components/room/Tile'

export default function join() {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { name } = router.query
	const [tiles, setTiles] = useState<
		{
			id: string
			isCurrentUser: boolean
		}[]
	>([])

	const co = useDaily()

	/* This is for displaying our self-view. */
	const localParticipant = useLocalParticipant()
	const localParticipantVideoTrack = useVideoTrack(localParticipant?.session_id)
	const localVideoElement = useRef<any>(null)

	// get all id of participant
	const remoteParticipantIds = useParticipantIds({ filter: 'remote' })

	useEffect(() => {
		if (!localParticipantVideoTrack.persistentTrack) return
		localVideoElement?.current &&
			(localVideoElement.current.srcObject =
				localParticipantVideoTrack.persistentTrack &&
				new MediaStream([localParticipantVideoTrack?.persistentTrack]))
	}, [localParticipantVideoTrack.persistentTrack])

	useEffect(() => {
		const data: { id: string; isCurrentUser: boolean }[] = []
		if (localParticipant) {
			data.push({
				id: localParticipant.session_id,
				isCurrentUser: true,
			})
		}
		if (remoteParticipantIds) {
			remoteParticipantIds.map(id=> {
				data.push({
					id,
					isCurrentUser: false,
				})
			})
		}
		setTiles(data)
	}, [localParticipant, remoteParticipantIds])

	useEffect(() => {
		console.log(tiles)
	}, [tiles])

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

	useEffect(() => {
		if (name && currentUser && co) {
			co.join({
				userName: currentUser.name,
				url: `${process.env.NEXT_PUBLIC_ZOOM_URL_JOIN}/${name}`,
			})
		}
	}, [name, currentUser, co])

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
				alignItems={'start'}
				w={'full'}
				pos={'relative'}
				height={'calc( 100% - 100px )'}
			>
				<Box padding={6} w={'full'} height={'calc( 100% - 10px )'}>
					<Swiper
						slidesPerView={5}
						spaceBetween={30}
						style={{
							width: '100%',
						}}
					>
						<div className="swiper-wrapper">
							{tiles.map((tile, key) => {
								return (
									<Tile
										id={tile.id}
										key={key}
										isCurrentUser={tile.isCurrentUser}
									/>
								)
							})}
						</div>
					</Swiper>

					<Box
						mt={'30px'}
						borderRadius={'20px'}
						w={'full'}
						h={'calc( 100% - 280px )'}
						background={localParticipant ? '#000000' : '#222222'}
						overflow={'hidden'}
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
					<Box w={'full'} height={'80px'} mt={'30px'} border={'1px solid red'}></Box>
				</Box>
				<Box w={'300px'} minW={'300px'}>
					1
				</Box>
			</HStack>
		</Box>
	)
}
