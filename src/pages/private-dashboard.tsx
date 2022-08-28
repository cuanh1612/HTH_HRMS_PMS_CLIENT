import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventInput } from '@fullcalendar/common'
import {
	Avatar,
	Badge,
	Box,
	Button,
	ButtonGroup,
	Collapse,
	Grid,
	HStack,
	StackDivider,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { Donut } from 'components/charts'
import { ButtonIcon, Card, Empty, Head, ItemDashboard } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	allNoticeBoardQuery,
	allNoticeBoardToQuery,
	allTasksByEmployeeQuery,
	countCompleteTasksQuery,
	countPendingTasksQuery,
	countProjectsEmployeeQuery,
	countStatusProjectsQuery,
	detailEmployeeQuery,
	eventsByEmployeeQuery,
	hoursLoggedEmployeeQuery,
	openTasksEmployeeQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineProject } from 'react-icons/ai'

import { NextLayout } from 'type/element/layout'
import DetailTask from './tasks/[taskId]'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import DetailEvent from './events/[eventId]'
import { VscTasklist } from 'react-icons/vsc'
import { BiTimeFive } from 'react-icons/bi'

const TaskCategory: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	const [taskId, setTaskId] = useState<string | number>()
	// set data to handle to calendar
	const [data, setData] = useState<EventInput[]>([])
	const [calendar, setCalendar] = useState<Calendar>()
	const [eventId, setEventId] = useState<number | null>(null)

	// set open detail task
	const {
		isOpen: isOpenDetailTask,
		onOpen: onOpenDetailTask,
		onClose: onCloseDetailTask,
	} = useDisclosure()
	const { onToggle: onToggleCards, isOpen: isOpenCards } = useDisclosure({
		defaultIsOpen: true,
	})
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

	//Query -------------------------------------------------------------------------------------------------
	const { data: dataEmployee } = detailEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: openTasksEmployee } = openTasksEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: hoursLoggedEmployee } = hoursLoggedEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: countProjectsEmployee } = countProjectsEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: dataAllTasks } = allTasksByEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: countPendingTasks } = countPendingTasksQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: countCompleteTasks } = countCompleteTasksQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: countStatusProjects } = countStatusProjectsQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	const { data: allEvents } = eventsByEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== 'Client' ? currentUser?.id : undefined
	)

	// query
	const { data: allNotices } =
		currentUser?.role === 'Admin'
			? allNoticeBoardQuery(isAuthenticated)
			: currentUser?.role === 'Employee'
			? allNoticeBoardToQuery(isAuthenticated, 'Employees')
			: allNoticeBoardToQuery(isAuthenticated, 'Clients')

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//User effect ---------------------------------------------------------------
	useEffect(() => {
		if (allEvents) {
			const newData = allEvents.Events?.map((item): EventInput => {
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
			calendar.on('dateClick', function (info) {})

			calendar.on('select', function (info) {})

			calendar.on('eventClick', (info) => {
				setEventId(Number(info.event.id))
				onOpenDetail()
			})

			calendar.on('eventDragStop', (info) => {})
		}
	}, [calendar])

	return (
		<Box w={'100%'} pb={8} pos={'relative'}>
			<Head title="Private dashboard" />
			<HStack
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggleCards}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
				mb={4}
			>
				<Text fontWeight={'semibold'}>Information</Text>
				{isOpenCards ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse in={isOpenCards} animateOpacity>
				<Grid
					overflow={'hidden'}
					templateColumns={[
						'repeat(1, 1fr)',
						'repeat(2, 1fr)',
						'repeat(3, 1fr)',
						null,
						'repeat(4, 1fr)',
					]}
					gap={6}
					mb={'30px'}
				>
					<Card
						link={'/'}
						icon={<VscTasklist fontSize={'20px'} />}
						title={'Open tasks'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={openTasksEmployee?.countOpentasks || 0}
					/>

					<Card
						link={'/'}
						icon={<AiOutlineProject fontSize={'20px'} />}
						title={'Projects'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={
							countProjectsEmployee?.countProjects
								? Number(countProjectsEmployee.countProjects)
								: 0
						}
					/>
					<Card
						link={'/'}
						icon={<BiTimeFive fontSize={'20px'} />}
						title={'Hours logged'}
						bg={'hu-Pink.lightH'}
						borderColor={'hu-Pink.normal'}
						text={`${hoursLoggedEmployee?.hoursLogged || 0} Hrs`}
					/>
					<Card
						link={'/'}
						icon={<VscTasklist fontSize={'20px'} />}
						title={'Pending tasks'}
						bg={'hu-Lam.lightH'}
						borderColor={'hu-Lam.normal'}
						text={`${countPendingTasks?.countPendingTasks || 0}`}
					/>
					<Card
						link={'/'}
						icon={<VscTasklist fontSize={'20px'} />}
						title={'Complete tasks'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={`${countCompleteTasks?.countCompleteTasks || 0}`}
					/>
				</Grid>
			</Collapse>
			<Grid
				w={'full'}
				templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']}
				gap={6}
			>
				<ItemDashboard title="Notices" overflow={'auto'}>
					<VStack
						spacing={5}
						w={'full'}
						divider={<StackDivider />}
						alignItems={'start'}
						justifyContent={'start'}
					>
						<HStack w={'full'} spacing={5}>
							<Avatar
								flex={'none'}
								size={'lg'}
								name={dataEmployee?.employee?.name}
								src={dataEmployee?.employee?.avatar?.url}
							/>
							<VStack w={'70%'} alignItems={'start'}>
								<Text isTruncated w={'full'}>
									{dataEmployee?.employee?.name}
								</Text>
								<Text isTruncated w={'full'} fontSize={'sm'} color={'gray.400'}>
									{dataEmployee?.employee?.role}
								</Text>
							</VStack>
						</HStack>
						<HStack>
							<Text color={'gray'}>Email:</Text>
							<Text>{dataEmployee?.employee?.email}</Text>
						</HStack>
						<HStack>
							<Text color={'gray'}>Hourly rate:</Text>
							<Text>{dataEmployee?.employee?.hourly_rate || 0}</Text>
						</HStack>
						<HStack>
							<Text color={'gray'}>Department:</Text>
							<Text>{dataEmployee?.employee?.department?.name}</Text>
						</HStack>
					</VStack>
				</ItemDashboard>
				<ItemDashboard title="Status project">
					{countStatusProjects?.countStatusProjects &&
					countStatusProjects?.countStatusProjects.length > 0 ? (
						<Donut
							colors={countStatusProjects.countStatusProjects.map((e) => {
								switch (e.project_status) {
									case 'Not Started':
										return '#718096'
									case 'In Progress':
										return '#3182ce'
									case 'On Hold':
										return '#D69E2E'
									case 'Canceled':
										return '#E53E3E'
									case 'Finished':
										return '#38A169'
									default:
										return ''
								}
							})}
							labels={countStatusProjects.countStatusProjects.map((e) => {
								return e.project_status
							})}
							data={
								countStatusProjects.countStatusProjects.map((e) => {
									return Number(e.count)
								}) as number[]
							}
							height={280}
						/>
					) : (
						<Empty height="220px" />
					)}
				</ItemDashboard>

				<ItemDashboard title="Pending Milestone" overflow={'auto'}>
					<TableContainer w={'full'}>
						{dataAllTasks?.tasks && dataAllTasks?.tasks?.length > 0 ? (
							<Table w={'full'} variant="simple">
								<Thead>
									<Tr>
										<Th>#</Th>
										<Th>Task</Th>
										<Th>Status</Th>
										<Th isNumeric>Due Date</Th>
									</Tr>
								</Thead>
								<Tbody w={'full'}>
									{dataAllTasks.tasks.map((item, key: number) => {
										return (
											<Tr key={key}>
												<Td>{item.id}</Td>
												<Td
													onClick={() => {
														setTaskId(item.id)
														onOpenDetailTask()
													}}
													_hover={{
														textDecoration: 'underline',
														cursor: 'pointer',
													}}
													whiteSpace={'normal'}
												>
													{item.name}
												</Td>
												<Td whiteSpace={'normal'}>
													<HStack
														display={['none', null, null, null, 'flex']}
														alignItems={'center'}
													>
														<Box
															w={'10px'}
															borderRadius={'full'}
															h={'10px'}
															bg={item.status.color}
														/>
														<Text>{item.status.title}</Text>
													</HStack>
												</Td>
												<Td
													color={
														new Date(item.deadline).getTime() <=
														new Date().getTime()
															? 'red'
															: 'black'
													}
													isNumeric
												>{`${new Date(item.deadline).getDate()}-${
													new Date(item.deadline).getMonth() + 1
												}-${new Date(item.deadline).getFullYear()}`}</Td>
											</Tr>
										)
									})}
								</Tbody>
							</Table>
						) : (
							<Empty height="220px" />
						)}
					</TableContainer>
				</ItemDashboard>

				<ItemDashboard title="Notices" overflow={'auto'}>
					{allNotices?.noticeBoards && allNotices.noticeBoards.length > 0 ? (
						<VStack
							spacing={5}
							w={'full'}
							divider={<StackDivider />}
							alignItems={'start'}
							justifyContent={'start'}
						>
							{allNotices &&
								allNotices.noticeBoards?.map((item, key) => (
									<HStack
										spacing={5}
										justifyContent={'start'}
										alignItems={'start'}
										key={key}
									>
										<Badge variant="subtle" colorScheme="green">
											{`${new Date(item.createdAt).getDate()}-${
												new Date(item.createdAt).getMonth() + 1
											}-${new Date(item.createdAt).getFullYear()}`}
										</Badge>
										<Link href={'/notice-boards'} passHref>
											<Text
												cursor={'pointer'}
												_hover={{
													textDecoration: 'underline',
												}}
											>
												{item.heading}
											</Text>
										</Link>
									</HStack>
								))}
						</VStack>
					) : (
						<Empty height="220px" />
					)}
				</ItemDashboard>

				<ItemDashboard heightAuto isFull title="Notices" overflow={'auto'}>
					<HStack className='card-demo' paddingBlock={'5'} justifyContent={'space-between'}>
						<ButtonGroup spacing={4}>
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
				</ItemDashboard>
			</Grid>

			<Drawer
				size="xl"
				title={`Task #${taskId}`}
				onClose={onCloseDetailTask}
				isOpen={isOpenDetailTask}
			>
				<DetailTask taskIdProp={taskId} onCloseDrawer={onCloseDetailTask} />
			</Drawer>
			<Drawer size="md" title="Detail Event" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailEvent EventIdProp={eventId} />
			</Drawer>
		</Box>
	)
}

TaskCategory.getLayout = ClientLayout
export default TaskCategory
