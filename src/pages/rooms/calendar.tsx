import {
	Box,
	Button,
	ButtonGroup,
	HStack,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { EventInput } from '@fullcalendar/common'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { AlertDialog, ButtonIcon, Func, FuncCollapse } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteRoomMutation } from 'mutations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allRoomsQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { BsCalendar2Day, BsCalendar2Month, BsCalendar2Week } from 'react-icons/bs'
import { IoAdd } from 'react-icons/io5'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import AddRooms from './add-rooms'
import UpdateRoom from './[roomId]/update-room'

const calendar: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	const [data, setData] = useState<EventInput[]>([])
	const [calendar, setCalendar] = useState<Calendar>()
	const [roomId, setRoomId] = useState<string | number>()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()
	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenCreRoom,
		onOpen: onOpenCreRoom,
		onClose: onCloseCreRoom,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()
	const { isOpen: isOpenUpRoom, onOpen: onOpenUpRoom, onClose: onCloseUpRoom } = useDisclosure()

	// query
	const { data: dataRooms, mutate: refetchAllRooms } = allRoomsQuery({
		isAuthenticated,
		role: currentUser?.role,
		id: currentUser?.id,
	})

	// mutation
	const [deleteRoom, { data: dataDl, status: statusDl }] = deleteRoomMutation(setToast)

	//useEffect ---------------------------------------------------------
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
		if (dataRooms) {
			const newData = dataRooms.rooms?.map((item): EventInput => {
				return {
					title: item.title,
					id: `${item.id}`,
					backgroundColor: `#B0E4DD`,
					textColor: '#008774',
					borderColor: `#008774`,
					start: new Date(`${item.date} ${item.start_time}`),
					end: new Date(`${item.date} 23:59:00`),
				}
			})
			setData(newData || [])
		}
	}, [dataRooms, colorMode])

	// set calendar
	useEffect(() => {
		setCalendar(
			new Calendar(document.getElementById('calendar') as HTMLElement, {
				plugins: [interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin],
				events: data,
				editable: false,
				selectable: true,
				headerToolbar: {
					center: undefined,
					right: undefined,
					left: 'title',
				},
				dayCellClassNames: 'dayCell',
				viewClassNames: 'view',
				eventClassNames: 'event',
				allDayClassNames: 'allDay',
				dayHeaderClassNames: dayHeader,
				moreLinkClassNames: 'moreLink',
				noEventsClassNames: 'noEvent',
				slotLaneClassNames: 'slotLane',
				slotLabelClassNames: 'slotLabel',
				weekNumberClassNames: 'weekNumber',
				nowIndicatorClassNames: 'nowIndicator',
			})
		)
	}, [data, colorMode])

	useEffect(() => {
		if (calendar) {
			calendar.render()
			calendar.on('eventClick', (info) => {
				// setTaskId(Number(info.event.id))
				// onOpenDetailTask()
			})
		}
	}, [calendar])

	useEffect(() => {
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDl,
			})
			refetchAllRooms()
		}
	}, [statusDl])

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Rooms</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new job by form'}
							title={'Add new'}
							action={onOpenCreRoom}
						/>
					</>
				)}
				<Func
					icon={<VscFilter />}
					description={'Open draw to filter'}
					title={'filter'}
					action={onOpenFilter}
				/>
				<Func
					icon={<BsCalendar2Day />}
					description={'Show calendar by day'}
					title={'Day'}
					action={() => {
						calendar?.changeView('timeGridDay')
					}}
				/>
				<Func
					icon={<BsCalendar2Week />}
					description={'Show calendar by week'}
					title={'Week'}
					action={() => calendar?.changeView('timeGridWeek')}
				/>
				<Func
					icon={<BsCalendar2Month />}
					description={'Show calendar by month'}
					title={'Month'}
					action={() => calendar?.changeView('dayGridMonth')}
				/>
			</FuncCollapse>
			<HStack pb={4} justifyContent={'space-between'}>
				<Text color={'gray.500'} fontWeight={'semibold'}>
					Calendar
				</Text>
				<ButtonGroup spacing={4}>
					<ButtonIcon
						handle={() => calendar?.prev()}
						ariaLabel={'first page'}
						icon={<MdOutlineNavigateBefore />}
					/>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.today()}
					>
						today
					</Button>
					<ButtonIcon
						handle={() => calendar?.next()}
						ariaLabel={'next page'}
						icon={<MdOutlineNavigateNext />}
					/>
				</ButtonGroup>
			</HStack>
			<Box id={'calendar'} />
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
				isOpen={isOpenFilter}
				size={'xs'}
				title={'Filter'}
				onClose={onCloseFilter}
				footer={<Button onClick={() => {}}>reset filter</Button>}
			>
				<VStack spacing={5} p={6}>
					1
				</VStack>
			</Drawer>
		</Box>
	)
}

calendar.getLayout = ClientLayout

export default calendar
