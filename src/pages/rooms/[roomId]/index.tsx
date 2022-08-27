import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Text,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailRoomQuery } from 'queries/room'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

export interface IDetailRoomProps {
	roomIdProp?: string | number
	onOpenUpdate?: any
	onOpenDl?: any
	onCloseDetailRoom?: any
}

export default function DetailRoom({
	roomIdProp,
	onOpenUpdate,
	onOpenDl,
	onCloseDetailRoom,
}: IDetailRoomProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { roomId: roomIdRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: detailRoom } = detailRoomQuery(
		isAuthenticated,
		roomIdProp || (roomIdRouter as string)
	)

	//User effect ---------------------------------------------------------------
	//Handle check logged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	return (
		<>
			<Box pos="relative" p={6}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={2}>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Room Title:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailRoom?.room?.title ? detailRoom?.room?.title : '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Description:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailRoom?.room?.description ? detailRoom?.room?.description : '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Start On Date:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailRoom?.room?.date
							? new Date(detailRoom?.room?.date).toLocaleDateString('es-CL')
							: '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Start On Time:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailRoom?.room?.start_time ? detailRoom?.room?.start_time : '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Employees:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<AvatarGroup size={'sm'} max={2}>
							{detailRoom?.room?.employees &&
								detailRoom.room.employees.map((employee) => (
									<Avatar
										key={employee.id}
										name={employee.name}
										src={employee.avatar?.url}
									/>
								))}
						</AvatarGroup>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Client:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<AvatarGroup size={'sm'} max={2}>
							{detailRoom?.room?.clients &&
								detailRoom.room.clients.map((client) => (
									<Avatar
										key={client.id}
										name={client.name}
										src={client.avatar?.url}
									/>
								))}
						</AvatarGroup>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Assign By:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailRoom?.room?.empl_create && (
							<HStack spacing={4}>
								<Avatar
									size={'sm'}
									key={detailRoom?.room?.empl_create.id}
									name={detailRoom?.room?.empl_create.name}
									src={detailRoom?.room?.empl_create.avatar?.url}
								/>
								<VStack align={'start'}>
									<Text>{detailRoom?.room?.empl_create.name}</Text>
									<Text fontSize={12} color={'gray.400'}>
										{detailRoom?.room?.empl_create.email}
									</Text>
								</VStack>
							</HStack>
						)}
					</GridItem>
				</Grid>
			</Box>
			{onOpenUpdate && (
				<Button
					onClick={() => {
						if (onCloseDetailRoom) {
							onCloseDetailRoom()
						}
						onOpenUpdate()
					}}
				>
					Update
				</Button>
			)}{' '}
			{onOpenDl && (
				<Button
					onClick={() => {
						if (onCloseDetailRoom) {
							onCloseDetailRoom()
						}
						onOpenDl()
					}}
				>
					Delete
				</Button>
			)}
		</>
	)
}
