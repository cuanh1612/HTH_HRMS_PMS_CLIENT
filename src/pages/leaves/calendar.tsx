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
	HStack,
	useDisclosure,
	VStack,
	useColorMode,
	useColorModeValue,
	Avatar,
	Text,
} from '@chakra-ui/react'

import { NextLayout } from 'type/element/layout'
// use layout
import { ClientLayout } from 'components/layouts'
import { AlertDialog, ButtonIcon, Func, FuncCollapse, Head } from 'components/common'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { Drawer } from 'components/Drawer'
import UpdateLeaves from './update-leaves'
import AddLeaves from './add-leaves'
import { useRouter } from 'next/router'
import { allEmployeesQuery, allLeaveQuery, allLeaveTypesQuery } from 'queries'
import { Select, SelectCustom } from 'components/filter'
import { IFilter } from 'type/tableTypes'
import { IOption } from 'type/basicTypes'
import DetailLeave from './[leaveId]'
import { deleteLeaveMutation } from 'mutations'

import { IoAdd } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { BsCalendar2Day, BsCalendar2Month, BsCalendar2Week } from 'react-icons/bs'

const calendar: NextLayout = () => {
	const { colorMode } = useColorMode()

	const router = useRouter()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const [calendar, setCalendar] = useState<Calendar>()
	const [data, setData] = useState<EventInput[]>([])
	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])
	const [employee, setEmployee] = useState<string>()
	const [type, setType] = useState<string>()
	const [status, setStatus] = useState<string>()
	const [leaveId, setLeaveId] = useState<number | null>(30)

	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onClose: onCloseFilter, onOpen: onOpenFilter } = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// query
	const { data: allLeaves, mutate: refetchAllLeaves } = allLeaveQuery({
		isAuthenticated,
		employee,
		status,
		leaveType: type,
	})

	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)
	const { data: allLeaveTypes } = allLeaveTypesQuery()

	// mutate
	// delete leave
	const [mutateDeleteLeave, { status: statusDl }] = deleteLeaveMutation(setToast)

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success') {
			setToast({
				msg: statusDl,
				type: 'success',
			})
			refetchAllLeaves()
			onCloseDetail()
		}
	}, [statusDl])

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
			calendar.on('eventClick', (info) => {
				setLeaveId(Number(info.event.id))
				onOpenDetail()
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
		<Box pb={8}>
			<Head title='Leaves calendar'/>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new job by form'}
							title={'Add new'}
							action={onOpenAdd}
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
				<Text color={'gray.500'} fontWeight={'semibold'}>Calendar</Text>
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
			{/* drawer to detail leave */}
			<Drawer size="md" title="Detail leave" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailLeave
					onOpenUpdate={() => {
						onOpenUpdate()
					}}
					onOpenDl={() => {
						onOpenDl()
					}}
					leaveId={leaveId}
				/>
			</Drawer>

			{/* drawer to update leave */}
			<Drawer size="xl" title="Update leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeaves onCloseDrawer={onCloseUpdate} leaveId={leaveId} />
			</Drawer>

			{/* drawer to add leave */}
			<Drawer size="xl" title="Add leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeaves onCloseDrawer={onCloseAdd} />
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					mutateDeleteLeave(String(leaveId))
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
							setEmployee(undefined)
							setStatus(undefined)
							setType(undefined)
						}}
					>
						Reset
					</Button>
				}
				isOpen={isOpenFilter}
				size={'xs'}
				title={'Leave detail'}
				onClose={onCloseFilter}
			>
				<VStack p={6} spacing={5}>
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
			</Drawer>
		</Box>
	)
}

calendar.getLayout = ClientLayout

export default calendar
