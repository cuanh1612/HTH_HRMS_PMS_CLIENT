import {
	Box,
	Button,
	ButtonGroup,
	HStack,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { Calendar, EventInput } from '@fullcalendar/core'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allHolidaysQuery } from 'queries'
import React, { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { AlertDialog, ButtonIcon } from 'components/common'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { Drawer } from 'components/Drawer'
import AddHoliday from './add-holidays'
import UpdateHoliday from './update-holidays'
import DetailHoliday from './[holidayId]'
import { deleteHolidayMutation } from 'mutations'
import { Select } from 'components/filter'
import { IFilter } from 'type/tableTypes'
import Head from 'next/head'

const calendar: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	// state -------------------------------------------------------
	const [calendar, setCalendar] = useState<Calendar>()
	const [data, setData] = useState<EventInput[]>([])
	const [holidayId, setHolidayId] = useState<number>(0)
	// set loading table
	const [_, setIsloading] = useState(true)
	const [filter, setFilter] = useState<{
		month?: number | string
		year?: number | string
	}>({})

	// set open drawer
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()
	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// get all holidays
	const { data: allHolidays, mutate: refetchAllHolidays } = allHolidaysQuery({ ...filter })

	// mutation
	// delete holiday
	const [mutateDeleteHoliday, { status: statusDl }] = deleteHolidayMutation(setToast)

	//User effect ---------------------------------------------------------------
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
		if (allHolidays) {
			const newData = allHolidays.holidays?.map((item): EventInput => {
				return {
					title: item.occasion,
					id: `${item.id}`,
					backgroundColor: `#D9F2EF`,
					textColor: '#00A991',
					date: item.holiday_date,
					borderColor: `#00A991`,
				}
			})
			setData(newData || [])
		}
	}, [allHolidays, colorMode])

	useEffect(() => {
		if (isOpenUpdate == false) {
			onCloseDetail()
		}
	}, [isOpenUpdate])

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
			if (filter) {
				var date = new Date()
				if (filter.month) {
					date = new Date(date.setMonth(Number(filter.month) - 1))
				}
				if (filter.year) {
					date = new Date(date.setFullYear(Number(filter.year)))
				}
				calendar.gotoDate(date)
			}
			calendar.render()
			calendar.on('dateClick', function (info) {
				console.log(info)
			})

			calendar.on('select', function (info) {
				console.log(info)
			})

			calendar.on('eventClick', (info) => {
				setHolidayId(Number(info.event.id))
				onOpenDetail()
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar, filter])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success') {
			setToast({
				msg: 'Delete employee successfully',
				type: 'success',
			})
			refetchAllHolidays()
			onCloseDetail()
		}
	}, [statusDl])

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Holidays calendar</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<HStack paddingBlock={'5'} justifyContent={'space-between'}>
				<ButtonGroup spacing={4}>
					<Button color={'white'} bg={'hu-Green.normal'} onClick={onOpenAdd}>
						Add new
					</Button>
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
					{/* <Button
						onClick={() => {
							setEmployee(undefined)
							setStatus(undefined)
							setType(undefined)
						}}
					>
						reset filter
					</Button> */}
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
			<Drawer size="xl" title="Add Holiday" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddHoliday onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Holiday" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateHoliday onCloseDrawer={onCloseUpdate} holidayId={holidayId} />
			</Drawer>
			<Drawer size="sm" title="Detail Holiday" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailHoliday
					onOpenDl={onOpenDl}
					onOpenUpdate={onOpenUpdate}
					holidayIdProp={holidayId}
				/>
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					mutateDeleteHoliday(String(holidayId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			<Drawer
				footer={
					<Button
						onClick={() => {
							setFilter({
								month: undefined,
								year: undefined,
							})
						}}
					>
						reset
					</Button>
				}
				isOpen={isOpenFilter}
				size={'xs'}
				title={'Filter'}
				onClose={onCloseFilter}
			>
				<VStack spacing={5} p={6}>
					<Select
						options={[
							{
								label: 'January',
								value: 1,
							},
							{
								label: 'February',
								value: 2,
							},
							{
								label: 'March',
								value: 3,
							},
							{
								label: 'April',
								value: 4,
							},
							{
								label: 'May',
								value: 5,
							},
							{
								label: 'June',
								value: 6,
							},
							{
								label: 'July',
								value: 7,
							},
							{
								label: 'August',
								value: 8,
							},
							{
								label: 'September',
								value: 9,
							},
							{
								label: 'October',
								value: 10,
							},
							{
								label: 'November',
								value: 11,
							},
							{
								label: 'December',
								value: 12,
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter((state) => ({
								...state,
								month: data.filterValue,
							}))
						}}
						columnId={'day'}
						label="Month"
						placeholder="Select month"
					/>

					<Select
						options={[
							{
								label: `${new Date().getFullYear()}`,
								value: `${new Date().getFullYear()}`,
							},
							{
								label: `${new Date().getFullYear() - 1}`,
								value: `${new Date().getFullYear() - 1}`,
							},
							{
								label: `${new Date().getFullYear() - 2}`,
								value: `${new Date().getFullYear() - 2}`,
							},
							{
								label: `${new Date().getFullYear() - 3}`,
								value: `${new Date().getFullYear() - 3}`,
							},
							{
								label: `${new Date().getFullYear() - 4}`,
								value: `${new Date().getFullYear() - 4}`,
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter((state) => ({
								...state,
								year: data.filterValue,
							}))
						}}
						columnId={'holiday_date'}
						label="Year"
						placeholder="Select year"
					/>
				</VStack>
			</Drawer>
		</Box>
	)
}

calendar.getLayout = ClientLayout

export default calendar
