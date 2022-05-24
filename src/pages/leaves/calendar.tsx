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
	Avatar,
	Text,
} from '@chakra-ui/react'

import { NextLayout } from 'type/element/layout'
// use layout
import { ClientLayout } from 'components/layouts'
import ButtonIcon from 'components/ButtonIcon'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import Drawer from 'components/Drawer'
import UpdateLeaves from './update-leaves'
import AddLeaves from './add-leaves'
import { useRouter } from 'next/router'
import { allEmployeesQuery, allLeaveQuery, allLeaveTypesQuery} from 'queries'
import { Select } from 'components/filter/Select'
import { IFilter } from 'type/tableTypes'
import { IOption } from 'type/basicTypes'
import SelectCustom from 'components/filter/SelectCustomer'

const calendar: NextLayout = () => {
	const { colorMode } = useColorMode()

	const router = useRouter()
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
	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])
	const [employee, setEmployee] = useState<string>()
	const [type, setType] = useState<string>()
	const [status, setStatus] = useState<string>()

	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure()
	const [leaveIdUpdate, setLeaveIdUpdate] = useState<number | null>(30)

	// query
	const { data: allLeaves } = allLeaveQuery({isAuthenticated, employee, status, leaveType: type})

	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)
	const { data: allLeaveTypes } = allLeaveTypesQuery()

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
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => {
							onOpenFilter()
						}}
					>
						filter
					</Button>
					<Button
						onClick={() => {
							setEmployee(undefined)
							setStatus(undefined)
							setType(undefined)
						}}
					>
						reset filter
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
												<Text
													color={colorMode == 'light' ? 'black' : 'white'}
												>
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

							<Select
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
									setStatus(data.filterValue)
								}}
								columnId={'status'}
								label="Leave status"
								placeholder="Select status"
								required={false}
							/>

							<Select
								options={allLeaveTypes?.leaveTypes?.map((leaveType) => ({
									label: leaveType.name,
									value: leaveType.id,
								}))}
								handleSearch={(data: IFilter) => {
									setType(data.filterValue)
								}}
								columnId={'leave_type'}
								label="Leave type"
								placeholder="Select type"
								required={false}
							/>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

calendar.getLayout = ClientLayout

export default calendar
