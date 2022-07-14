import {
	Avatar,
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
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allEventsQuery, allEmployeesNormalQuery, allClientsQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import AddEvent from './add-events'
import UpdateEvent from './update-events'
import { AlertDialog, ButtonIcon } from 'components/common'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { Input, SelectCustom } from 'components/filter'
import { AiOutlineSearch } from 'react-icons/ai'
import { IFilter } from 'type/tableTypes'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'
import DetailEvent from './[eventId]'
import { deleteEventMutation } from 'mutations'
import Head from 'next/head'

var timeoutName: NodeJS.Timeout

const Event: NextLayout = () => {
	const { isAuthenticated, handleLoading, socket, currentUser, setToast } =
		useContext(AuthContext)
	const router = useRouter()

	const { colorMode } = useColorMode()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	//State ---------------------------------------------------------------------
	const [eventId, setEventId] = useState<number | null>(null)

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// set data to handle to calendar
	const [data, setData] = useState<EventInput[]>([])
	const [calendar, setCalendar] = useState<Calendar>()

	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])
	const [employee, setEmployee] = useState<string>()

	const [clientsFilter, setClientsFilter] = useState<IOption[]>([])
	const [client, setClient] = useState<string>()

	const [name, setName] = useState<string>()

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'name', key: 'name' },
		{ label: 'color', key: 'color' },
		{ label: 'description', key: 'description' },
		{ label: 'where', key: 'where' },
		{ label: 'starts_on_date', key: 'starts_on_date' },
		{ label: 'starts_on_time', key: 'starts_on_time' },
		{ label: 'ends_on_date', key: 'ends_on_date' },
		{ label: 'ends_on_time', key: 'ends_on_time' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure()

	// get all event
	const { data: allEvents, mutate: refetchEvents } = allEventsQuery(
		isAuthenticated,
		employee,
		client,
		name
	)

	// delete
	const [mutateDlEvent, { status: statusDl, data: dataDl }] = deleteEventMutation(setToast)

	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)
	const { data: allClients } = allClientsQuery(isAuthenticated)

	//User effect ---------------------------------------------------------------
	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl?.message,
				type: statusDl,
			})
			refetchEvents()
			onCloseDetail()
		}
	}, [statusDl])

	useEffect(() => {
		if (allEvents) {
			const newData = allEvents.Events?.map((item): EventInput => {
				console.log(new Date(item.starts_on_date).getMonth() + 1)
				return {
					title: item.name,
					id: `${item.id}`,
					backgroundColor: `${item.color}${colorMode == 'light' ? '30' : ''}`,
					textColor: colorMode != 'light' ? 'white' : item.color,
					start: new Date(`${item.starts_on_date} ${item.starts_on_time}`),
					end: new Date(`${item.ends_on_date} ${item.ends_on_time}`),
					borderColor: `${item.color}`,
				}
			})
			setData(newData || [])

			if (allEvents.Events) {
				//Set data csv
				const dataCSV: any[] = allEvents.Events.map((event) => ({
					id: event.id,
					name: event.name,
					color: event.color,
					description: event.description,
					where: event.where,
					starts_on_date: event.starts_on_date,
					starts_on_time: event.starts_on_time,
					ends_on_date: event.ends_on_date,
					ends_on_time: event.ends_on_time,
					createdAt: event.createdAt,
					updatedAt: event.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [allEvents, colorMode])

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
			calendar.on('dateClick', function (info) {
				console.log(info)
			})

			calendar.on('select', function (info) {
				console.log(info)
			})

			calendar.on('eventClick', (info) => {
				setEventId(Number(info.event.id))
				onOpenDetail()
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar])

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

	// set employee to filter
	useEffect(() => {
		if (allEmployees?.employees) {
			const valuesFilter = allEmployees.employees.map(
				(employee): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{employee.name}
								</Text>
							</HStack>
						</>
					),
					value: String(employee.id),
				})
			)
			setEmployeesFilter(valuesFilter)
		}
	}, [allEmployees, colorMode])

	// set client to filter
	useEffect(() => {
		if (allClients?.clients) {
			const valuesFilter = allClients.clients.map(
				(client): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar size={'xs'} name={client.name} src={client.avatar?.url} />
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{client.name}
								</Text>
							</HStack>
						</>
					),
					value: String(client.id),
				})
			)
			setClientsFilter(valuesFilter)
		}
	}, [allClients, colorMode])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket) {
			socket.emit('joinRoomEvent')

			socket.on('getNewEvent', () => {
				refetchEvents()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket) {
				socket.emit('leaveRoomEvent')
			}
		}

		return leaveRoom
	}, [socket])

	return (
		<Box w={'full'} pb={8}>
			<Head>
				<title>Huprom - Events</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<HStack paddingBlock={'5'} justifyContent={'space-between'}>
				<ButtonGroup spacing={4}>
					<Button color={'white'} bg={'hu-Green.normal'} onClick={() => onOpenAdd()}>
						Add event
					</Button>
					{currentUser && currentUser.role === 'Admin' && (
						<Button
							transform={'auto'}
							bg={'hu-Green.lightA'}
							_hover={{
								bg: 'hu-Green.normal',
								color: 'white',
								scale: 1.05,
							}}
							color={'hu-Green.normal'}
							leftIcon={<FaFileCsv />}
						>
							<CSVLink filename={'events.csv'} headers={headersCSV} data={dataCSV}>
								export to csv
							</CSVLink>
						</Button>
					)}
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.changeView('timeGridDay')}
					>
						Day
					</Button>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.changeView('timeGridWeek')}
					>
						Week
					</Button>

					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.changeView('listWeek')}
					>
						listWeek
					</Button>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.changeView('dayGridMonth')}
					>
						Month
					</Button>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => {
							onOpenFilter()
						}}
					>
						filter
					</Button>
				</ButtonGroup>

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

			<Drawer size="xl" title="Add Event" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddEvent onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Event" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateEvent onCloseDrawer={onCloseUpdate} eventIdUpdate={eventId} />
			</Drawer>
			<Drawer size="md" title="Detail Event" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailEvent
					onOpenUpdate={() => {
						onOpenUpdate()
						onCloseDetail()
					}}
					onOpenDl={() => {
						onOpenDl()
					}}
					EventIdProp={eventId}
				/>
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					mutateDlEvent(String(eventId))
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
				footer={
					<Button
						onClick={() => {
							setEmployee(undefined)
							setClient(undefined)
							setName(undefined)
						}}
					>
						reset
					</Button>
				}
				onClose={onCloseFilter}
			>
				<VStack p={6} spacing={5}>
					<Input
						handleSearch={(data: IFilter) => {
							clearTimeout(timeoutName)
							timeoutName = setTimeout(() => {
								setName(data.filterValue)
							}, 500)
						}}
						columnId={'name'}
						label="Event name"
						placeholder="Enter name"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					{employeesFilter && (
						<SelectCustom
							handleSearch={(field: any) => {
								setEmployee(String(field.value))
							}}
							label={'Employee'}
							name={'employee'}
							options={[
								{
									label: (
										<Text color={colorMode == 'light' ? 'black' : 'white'}>
											all
										</Text>
									),
									value: '',
								},

								...employeesFilter,
							]}
							required={false}
						/>
					)}

					{clientsFilter && (
						<SelectCustom
							handleSearch={(field: any) => {
								setClient(String(field.value))
							}}
							label={'Client'}
							name={'client'}
							options={[
								{
									label: (
										<Text color={colorMode == 'light' ? 'black' : 'white'}>
											all
										</Text>
									),
									value: '',
								},

								...clientsFilter,
							]}
							required={false}
						/>
					)}
				</VStack>
			</Drawer>
		</Box>
	)
}

Event.getLayout = ClientLayout

export default Event
