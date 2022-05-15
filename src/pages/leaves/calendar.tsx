import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'

import { Calendar, EventInput } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import {
	Box,
	Button,
	ButtonGroup,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	useDisclosure,
	VStack,
	Drawer as CDrawer,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'

import { allLeaveQuery } from 'queries/leave'

import { NextLayout } from 'type/element/layout'
// use layout
import { ClientLayout } from 'components/layouts'
import ButtonIcon from 'components/ButtonIcon'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import Drawer from 'components/Drawer'
import UpdateLeaves from './update-leaves'
import AddLeaves from './add-leaves'

const calendar: NextLayout = () => {
	const { colorMode } = useColorMode()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	// set filter
	// const [filter, setFilter] = useState<IFilter>({
	// 	columnId: '',
	// 	filterValue: '',
	// })

	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const [calendar, setCalendar] = useState<Calendar>()
	const [data, setData] = useState<EventInput[]>([])

	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onClose: onCloseFilter } = useDisclosure()
	const [leaveIdUpdate, setLeaveIdUpdate] = useState<number | null>(30)

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	const { data: allLeaves } = allLeaveQuery(isAuthenticated)

	useEffect(() => {
		if (allLeaves) {
			const newData = allLeaves.leaves?.map((item): EventInput => {
				return {
					title: item.employee.name,
					id: `${item.id}`,
					backgroundColor: `${item.leave_type.color_code}${
						colorMode == 'light' ? '30' : ''
					}`,
					textColor: colorMode != 'light' ? 'white' : item.leave_type.color_code,
					date: item.date,
					borderColor: `${item.leave_type.color_code}`,
				}
			})
			setData(newData || [])
		}
	}, [allLeaves, colorMode])

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
				setLeaveIdUpdate(Number(info.event.id))
				onOpenUpdate()
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar])

	return (
		<Box>
			<HStack paddingBlock={'5'} justifyContent={'space-between'}>
				<ButtonGroup spacing={4}>
					<Button color={'white'} bg={'hu-Green.normal'} onClick={() => onOpenAdd()}>
						Add leave
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
			{/* drawer to update leave */}
			<Drawer size="xl" title="Update leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeaves onCloseDrawer={onCloseUpdate} leaveId={leaveIdUpdate} />
			</Drawer>

			{/* drawer to add leave */}
			<Drawer size="xl" title="Add leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeaves onCloseDrawer={onCloseAdd} />
			</Drawer>
			<CDrawer isOpen={isOpenFilter} placement="right" onClose={onCloseFilter}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Filters</DrawerHeader>

					<DrawerBody>
						<VStack spacing={5}>
							{/* <Input
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'email'}
								label="Email"
								placeholder="Enter email"
								required={false}
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
								type={'text'}
							/> */}

							{/* <Select
								options={[
									{
										label: 'Pending',
										value: 'Pending',
									},
									{
										label: 'Rejected',
										value: 'Rejected',
									},
									{
										label: 'Approved',
										value: 'Approved',
									},
								]}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'status'}
								label="Leave status"
								placeholder="Select status"
								required={false}
							/>
							<Select
								options={[
									{
										label: String(year - 2),
										value: String(year - 2),
									},
									{
										label: String(year - 1),
										value: String(year - 1),
									},
									{
										label: String(year),
										value: String(year),
									},
									{
										label: String(year + 1),
										value: String(year + 1),
									},
								]}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'year'}
								label="Year"
								placeholder="Select year"
								required={false}
							/> */}

							{/* <Select
								options={leaveTypes}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'leave_type'}
								label="Leave type"
								placeholder="Select type"
								required={false}
							/> */}

							{/* <DateRange
								handleSelect={(date: { from: Date; to: Date }) => {
									setFilter({
										columnId: 'date',
										filterValue: date,
									})
								}}
								label="Select date"
							/>
							<SelectUser
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'id'}
								required={false}
								label={'User'}
								peoples={dataUsersSl}
							/> */}
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

calendar.getLayout = ClientLayout

export default calendar
