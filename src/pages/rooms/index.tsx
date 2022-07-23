import { Button, Grid, GridItem, Skeleton, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { Cards } from 'components/room'
import { AuthContext } from 'contexts/AuthContext'
import { deleteRoomMutation } from 'mutations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allRoomsQuery } from 'queries'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { MdOutlineEvent } from 'react-icons/md'
import { VscFilter } from 'react-icons/vsc'

import { NextLayout } from 'type/element/layout'
import { IFilter } from 'type/tableTypes'
import AddRooms from './add-rooms'
import UpdateRoom from './[roomId]/update-room'

const zoom: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [roomId, setRoomId] = useState<string | number>()
	const [filter, setFilter] = useState<{
		date: {
			from?: Date,
			to?: Date
		},
		title: string
	}>({
		date: {
			from: undefined,
			to: undefined
		},
		title: ''
	})

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenCreRoom,
		onOpen: onOpenCreRoom,
		onClose: onCloseCreRoom,
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

	//Useeffect ---------------------------------------------------------
	//Handle check loged in
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
	return (
		<VStack justifyContent={'start'} pb={8} alignItems={'start'} w={'full'} spacing={5}>
			<Head>
				<title>Huprom - Rooms</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

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
				{dataRooms?.rooms && dataRooms.rooms.length > 0 ? (
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
							data={dataRooms.rooms}
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
					another rooms:
				</Text>
				{dataRooms?.another_rooms && dataRooms.another_rooms.length > 0 ? (
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
						<Cards isEdit={false} data={dataRooms.another_rooms} />
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
							setFilter(state => ({
								...state,
								title: data.filterValue
							}))
						}}
						columnId={'name'}
						label="Project name"
						placeholder="Enter project name"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>
					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter(state => ({
								...state,
								date
							}))
						}}
						label="Select date"
					/>


				</VStack>
			</Drawer>
		</VStack>
	)
}

zoom.getLayout = ClientLayout
export default zoom
