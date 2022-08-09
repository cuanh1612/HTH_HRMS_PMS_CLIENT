import { Button, Grid, GridItem, Skeleton, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Head } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { Cards } from 'components/room'
import { AuthContext } from 'contexts/AuthContext'
import { deleteRoomMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allRoomsQuery } from 'queries'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { MdOutlineEvent } from 'react-icons/md'
import { VscFilter } from 'react-icons/vsc'
import { filterRooms, roomType } from 'type/basicTypes'

import { NextLayout } from 'type/element/layout'
import { IFilter } from 'type/tableTypes'
import AddRooms from './add-rooms'
import DetailRoom from './[roomId]'
import UpdateRoom from './[roomId]/update-room'

let textTimeOut: NodeJS.Timeout
const zoom: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [yourRooms, setYourRooms] = useState<roomType[]>()
	const [otherRooms, setOtherRooms] = useState<roomType[]>()
	const [roomId, setRoomId] = useState<string | number>()
	const [filter, setFilter] = useState<filterRooms>({ title: '', date: {} })

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenCreRoom,
		onOpen: onOpenCreRoom,
		onClose: onCloseCreRoom,
	} = useDisclosure()

	const {
		isOpen: isOpenDetailRoom,
		onOpen: onOpenDetailRoom,
		onClose: onCloseDetailRoom,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()
	const { isOpen: isOpenUpRoom, onOpen: onOpenUpRoom, onClose: onCloseUpRoom } = useDisclosure()
	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// query
	const { data: dataRooms, mutate: refetchAllRooms } = allRoomsQuery({
		isAuthenticated,
		role: currentUser?.role,
		id: currentUser?.id,
	})

	// mutation
	const [deleteRoom, { data: dataDl, status: statusDl }] = deleteRoomMutation(setToast)

	const handleFilterRooms = useCallback((rooms: roomType[], filter: filterRooms) => {
		let data: roomType[] = rooms
		if (filter.title) {
			data = data.filter((room) => {
				if (room.title.replace(/-/g, ' ').includes(filter.title)) {
					return true
				}
				return false
			})
		}
		if (filter.date?.from) {
			const date = filter.date.from
			data = data.filter((room) => {
				if (new Date(room.date) >= new Date(date)) {
					return true
				}
				return false
			})
		}
		if (filter.date?.to) {
			const date = filter.date.to
			data = data.filter((room) => {
				if (new Date(room.date) <= new Date(date)) {
					return true
				}
				return false
			})
		}
		return data
	}, [])

	//UseEffect ---------------------------------------------------------
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

	useEffect(() => {
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDl,
			})
			refetchAllRooms()
		}
	}, [statusDl])

	useEffect(() => {
		if (dataRooms) {
			if (dataRooms.rooms) {
				setYourRooms(dataRooms.rooms)
			}
			if (dataRooms.other_rooms) {
				setOtherRooms(dataRooms.other_rooms)
			}
		}
	}, [dataRooms, filter])

	useEffect(() => {
		if (filter) {
			if (dataRooms?.rooms) {
				const data = handleFilterRooms(dataRooms.rooms, filter)
				setYourRooms(data)
			}
			if (dataRooms?.other_rooms) {
				const data = handleFilterRooms(dataRooms.other_rooms, filter)
				setOtherRooms(data)
			}
		}
	}, [filter])

	// show alert when delete
	const showAlertDl = useCallback((id: number) => {
		setRoomId(id)
		onOpenDl()
	}, [])

	// show update
	const showUpdate = (id: number) => {
		setRoomId(id)
		onOpenUpRoom()
	}

	// show detail
	const showDetail = (id: number) => {
		setRoomId(id)
		onOpenDetailRoom()
	}
	return (
		<VStack justifyContent={'start'} pb={8} alignItems={'start'} w={'full'} spacing={5}>
			<Head title={'Rooms'} />
			<FuncCollapse>
				<Func
					icon={<IoAdd />}
					description={'Add new meeting by form'}
					title={'Add new'}
					action={onOpenCreRoom}
				/>
				<Func
					icon={<VscFilter />}
					description={'Open draw to filter'}
					title={'filter'}
					action={onOpenFilter}
				/>
				<Func
					icon={<MdOutlineEvent />}
					title={'Calendar'}
					description={'show holidays as calendar'}
					action={() => {
						router.push('/rooms/calendar')
					}}
				/>
			</FuncCollapse>

			<VStack w={'full'} spacing={5}>
				<Text w={'full'} fontWeight={'bold'} fontSize={'xl'}>
					Your rooms:
				</Text>

				{yourRooms && yourRooms.length > 0 ? (
					<Grid
						w={'full'}
						templateColumns={[
							'repeat(1, 1fr)',
							'repeat(2, 1fr)',
							null,
							null,
							'repeat(3, 1fr)',
						]}
						gap={6}
					>
						<Cards
							showAlertDl={showAlertDl}
							showUpdate={showUpdate}
							showDetail={showDetail}
							data={yourRooms}
						/>
					</Grid>
				) : (
					<Grid
						w={'full'}
						templateColumns={[
							'repeat(1, 1fr)',
							'repeat(2, 1fr)',
							null,
							null,
							'repeat(3, 1fr)',
						]}
						gap={6}
					>
						<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
							<Skeleton height="100%" w={'full'} />
						</GridItem>
						<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
							<Skeleton height="100%" w={'full'} />
						</GridItem>
						<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
							<Skeleton height="100%" w={'full'} />
						</GridItem>
					</Grid>
				)}
			</VStack>

			<VStack w={'full'} spacing={5}>
				<Text w={'full'} fontWeight={'bold'} fontSize={'xl'}>
					Other rooms:
				</Text>
				{otherRooms && otherRooms.length > 0 ? (
					<Grid
						w={'full'}
						templateColumns={[
							'repeat(1, 1fr)',
							'repeat(2, 1fr)',
							null,
							null,
							'repeat(3, 1fr)',
						]}
						gap={6}
					>
						<Cards isEdit={false} data={otherRooms} />
					</Grid>
				) : (
					<Grid
						w={'full'}
						templateColumns={[
							'repeat(1, 1fr)',
							'repeat(2, 1fr)',
							null,
							null,
							'repeat(3, 1fr)',
						]}
						gap={6}
					>
						<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
							<Skeleton height="100%" w={'full'} />
						</GridItem>
						<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
							<Skeleton height="100%" w={'full'} />
						</GridItem>
						<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
							<Skeleton height="100%" w={'full'} />
						</GridItem>
					</Grid>
				)}
			</VStack>

			<Drawer size="xl" title="Add Room" onClose={onCloseCreRoom} isOpen={isOpenCreRoom}>
				<AddRooms onCloseDrawer={onCloseCreRoom} />
			</Drawer>

			<Drawer size="xl" title="Update Room" onClose={onCloseUpRoom} isOpen={isOpenUpRoom}>
				<UpdateRoom onCloseDrawer={onCloseUpRoom} roomId={roomId} />
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					deleteRoom(String(roomId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>
			<Drawer
				title="Filter"
				size="xs"
				footer={
					<Button
						onClick={() => {
							setFilter({
								title: '',
								date: {
									from: undefined,
									to: undefined,
								},
							})
						}}
					>
						reset
					</Button>
				}
				isOpen={isOpenFilter}
				onClose={onCloseFilter}
			>
				<VStack spacing={5} p={6}>
					<Input
						handleSearch={(data: IFilter) => {
							clearTimeout(textTimeOut)
							textTimeOut = setTimeout(() => {
								setFilter((state) => ({
									...state,
									title: data.filterValue,
								}))
							}, 200)
						}}
						columnId={'name'}
						label="Project name"
						placeholder="Enter project name"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>
					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter((state) => ({
								...state,
								date,
							}))
						}}
						label="Select date"
					/>
				</VStack>
			</Drawer>

			<Drawer
				size="md"
				title="Detail Room"
				onClose={onCloseDetailRoom}
				isOpen={isOpenDetailRoom}
			>
				<DetailRoom roomIdProp={roomId} />
			</Drawer>
		</VStack>
	)
}

zoom.getLayout = ClientLayout
export default zoom
