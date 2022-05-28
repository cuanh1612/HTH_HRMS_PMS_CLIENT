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
	useColorMode,
	useColorModeValue,
	useDisclosure,
	VStack,
	Drawer as CDrawer,
	Avatar,
	Text,
} from '@chakra-ui/react'
import { EventInput } from '@fullcalendar/common'
import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import {
	allClientsNormalQuery,
	allEmployeesNormalQuery,
	allProjectsNormalQuery,
	allTasksCalendarQuery,
} from 'queries'
import React, { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import { AlertDialog, ButtonIcon } from 'components/common'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import AddTask from './add-tasks'
import { Drawer } from 'components/Drawer'
import DetailTask from './[taskId]'
import { deleteTaskMutation } from 'mutations'
import UpdateTask from './[taskId]/update-task'
import { Select, SelectCustom } from 'components/filter'
import { IFilter } from 'type/tableTypes'
import { IOption } from 'type/basicTypes'

const calendar: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	// state
	// set data to handle to calendar
	const [data, setData] = useState<EventInput[]>([])
	const [calendar, setCalendar] = useState<Calendar>()

	// get task id to show detail, update, or delete
	const [taskId, setTaskId] = useState<string | number>()

	// filter
	const [filter, setFilter] = useState<{
		name?: string
		employee?: number
		project?: number
		client?: number
	}>()

	// set employees to filter
	const [employeesFilter, setEmplsFilter] = useState<IOption[]>([])
	//  set clients to filter
	const [clientsFilter, setClientsFilter] = useState<IOption[]>([])

	// query
	// get all tasks
	const { data: allTasks, mutate: refetchTasks } = allTasksCalendarQuery({
		isAuthenticated,
		...filter,
	})

	// get all projects to filter
	const { data: dataAllProjects } = allProjectsNormalQuery(isAuthenticated)

	// get all employees to filter
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)
	// get all clients to filter
	const { data: allClients } = allClientsNormalQuery(isAuthenticated)

	// mutation
	// delete one
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteTaskMutation(setToast)

	// set open add task
	const {
		isOpen: isOpenAddTask,
		onOpen: onOpenAddTask,
		onClose: onCloseAddTask,
	} = useDisclosure()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set open detail task
	const {
		isOpen: isOpenDetailTask,
		onOpen: onOpenDetailTask,
		onClose: onCloseDetailTask,
	} = useDisclosure()

	// set open update task
	const {
		isOpen: isOpenUpdateTask,
		onOpen: onOpenUpdateTask,
		onClose: onCloseUpdateTask,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

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
		if (allTasks) {
			const newData = allTasks.tasks?.map((item): EventInput => {
				return {
					title: item.name,
					id: `${item.id}`,
					backgroundColor: `${item?.status?.color}${colorMode == 'light' ? '30' : ''}`,
					textColor: colorMode != 'light' ? 'white' : item?.status?.color,
					start: new Date(item.start_date),
					end: new Date(item.deadline),
					borderColor: `${item?.status?.color}`,
				}
			})
			setData(newData || [])
		}
	}, [allTasks, colorMode])

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
				setTaskId(Number(info.event.id))
				onOpenDetailTask()
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar])

	// when delete one success
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: 'success',
				msg: dataDlOne.message,
			})
			onCloseDetailTask()
			refetchTasks()
		}
	}, [statusDlOne])

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
			setEmplsFilter(valuesFilter)
		}
	}, [allEmployees, colorMode])

	// set employee to filter
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

	return (
		<>
			<HStack paddingBlock={'5'} justifyContent={'space-between'}>
				<ButtonGroup spacing={4}>
					<Button color={'white'} bg={'hu-Green.normal'} onClick={() => onOpenAddTask()}>
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
					<Button
						onClick={() => {
							setFilter(undefined)
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
			{/* add */}
			<Drawer size="xl" title="Add New Task" onClose={onCloseAddTask} isOpen={isOpenAddTask}>
				<AddTask onCloseDrawer={onCloseAddTask} />
			</Drawer>
			{/* update */}
			<Drawer
				size="xl"
				title="Update Task"
				onClose={onCloseUpdateTask}
				isOpen={isOpenUpdateTask}
			>
				<UpdateTask taskIdProp={taskId} onCloseDrawer={onCloseUpdateTask} />
			</Drawer>
			{/* show detail */}
			<Drawer
				size="xl"
				title={`Task #${taskId}`}
				onClose={onCloseDetailTask}
				isOpen={isOpenDetailTask}
			>
				<DetailTask
					onOpenDl={() => {
						onOpenDl()
					}}
					onOpenUpdate={() => {
						onCloseDetailTask()
						onOpenUpdateTask()
					}}
					taskIdProp={taskId}
					onCloseDrawer={onCloseDetailTask}
				/>
			</Drawer>
			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					deleteOne(String(taskId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			<CDrawer isOpen={isOpenFilter} placement="right" onClose={onCloseFilter}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Filters</DrawerHeader>

					<DrawerBody>
						<VStack spacing={5}>
							<Select
								options={dataAllProjects?.projects?.map((project) => ({
									label: project.name,
									value: project.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter((state) => ({
										...state,
										project: data.filterValue,
									}))
								}}
								columnId={'project'}
								label="Project"
								placeholder="Select project"
							/>
							<SelectCustom
								handleSearch={(field: any) => {
									setFilter((state) => ({
										...state,
										employee: Number(field.value),
									}))
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
							<SelectCustom
								handleSearch={(field: any) => {
									setFilter((state) => ({
										...state,
										client: Number(field.value),
									}))
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
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</>
	)
}

calendar.getLayout = ClientLayout
export default calendar
