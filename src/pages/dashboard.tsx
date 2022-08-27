import {
	Avatar,
	Badge,
	Box,
	Button,
	Collapse,
	Grid,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	StackDivider,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'

import { Area, Bar, Donut, Line } from 'components/charts'
import { Card, Head, ItemDashboard } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { updateStatusMutation } from 'mutations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	clientWiseEarningsQuery,
	clientWiseTimeLogsQuery,
	contractsGeneratedQuery,
	contractsSignedQuery,
	countByDateAttendanceQuery,
	countByDateLeaveQuery,
	countProjectsOverdueQuery,
	hoursLoggedQuery,
	lastestClientsQuery,
	pendingLeavesRawQuery,
	pendingMilestoneQuery,
	pendingTasksQuery,
	pendingTasksRawQuery,
	projectsEarningQuery,
	statusWiseProjects,
	todayAttendanceQuery,
	totalClientsQuery,
	totalEmployeesQuery,
	totalProjectsQuery,
} from 'queries/dashboard'
import { useContext, useEffect, useState } from 'react'
import {
	AiOutlineCaretDown,
	AiOutlineCaretUp,
	AiOutlineCheck,
	AiOutlineProject,
} from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import { BsCheck2, BsPerson } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineMoreVert } from 'react-icons/md'
import { VscTasklist } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import DetailLeave from './leaves/[leaveId]'
import DetailTask from './tasks/[taskId]'
import { GrDocumentText } from 'react-icons/gr'
import { clientType } from 'type/basicTypes'
import 'intro.js/introjs.css'
import introJs from 'intro.js'
import { IFilter } from 'type/tableTypes'
import { Select } from 'components/filter'

const dashboard: NextLayout = () => {
	const [date, setDate] = useState(new Date())

	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	const [leaveId, setLeaveId] = useState<number | null>(30)
	const [taskId, setTaskId] = useState<string | number>()

	//
	const { onToggle: onToggleCards, isOpen: isOpenCards } = useDisclosure({
		defaultIsOpen: true,
	})

	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
	// set open detail task
	const {
		isOpen: isOpenDetailTask,
		onOpen: onOpenDetailTask,
		onClose: onCloseDetailTask,
	} = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataPendingTasks } = pendingTasksQuery(isAuthenticated)
	const { data: dataTotalClients } = totalClientsQuery(isAuthenticated)
	const { data: dataTotalEmployees } = totalEmployeesQuery(isAuthenticated)
	const { data: dataTotalProjects } = totalProjectsQuery(isAuthenticated)
	const { data: dataTodayAttendance } = todayAttendanceQuery(isAuthenticated)
	const { data: dataPendingTasksRaw } = pendingTasksRawQuery({isAuthenticated, date})
	const { data: dataPendingLeavesRaw, mutate: refetchDataPendingLeavesRaw } =
		pendingLeavesRawQuery({isAuthenticated, date})
	const { data: dataHoursLoged } = hoursLoggedQuery(isAuthenticated)
	const { data: dataStatusWiseProjects } = statusWiseProjects(isAuthenticated)
	const { data: dataContractsGenerated } = contractsGeneratedQuery(isAuthenticated)
	const { data: dataPendingMilestone } = pendingMilestoneQuery({isAuthenticated, date})
	const { data: dataContractsSigned } = contractsSignedQuery(isAuthenticated)
	const { data: dataClientWiseEarnings } = clientWiseEarningsQuery({isAuthenticated, date})
	const { data: dataClientWiseTimeLogs } = clientWiseTimeLogsQuery({isAuthenticated, date})
	const { data: dataLastestClients } = lastestClientsQuery({isAuthenticated, date})
	const { data: dataProjectsEarning } = projectsEarningQuery(isAuthenticated)
	const { data: dataCountByDateAttendance } = countByDateAttendanceQuery({isAuthenticated, date})
	const { data: dataCountByDateLeave } = countByDateLeaveQuery({isAuthenticated, date})
	const { data: dataCountProjectsOverdue } = countProjectsOverdueQuery(isAuthenticated)

	// mutation ----------------------------------------
	// update status of leave
	const [mutateUpdateStatus, { status: statusUpStatus, data: dataUpdate }] =
		updateStatusMutation(setToast)

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

	// alert when update status success
	useEffect(() => {
		if (statusUpStatus == 'success' && dataUpdate) {
			setToast({
				type: statusUpStatus,
				msg: dataUpdate.message,
			})
			refetchDataPendingLeavesRaw()
		}
	}, [statusUpStatus])

	return (
		<Box w={'100%'} pb={8} pos={'relative'}>
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
					setDate(state => new Date(state.setMonth(data.filterValue - 1)))
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
					setDate(state => new Date(state.setFullYear(data.filterValue)))
				}}
				columnId={'holiday_date'}
				label="Year"
				placeholder="Select year"
			/>
			<Button onClick={() => introJs().start()}>enter</Button>
			<Head title="Dashboards" />
			<HStack
				data-title="Welcome!"
				data-intro="Hello World! 👋"
				className="card-demo"
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
					data-title="Welcome!"
					data-intro={
						'<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">'
					}
					className="card-demo"
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
						link={'/clients'}
						icon={<BsPerson fontSize={'20px'} />}
						title={'Total clients'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataTotalClients?.totalClients || 0}
					/>
					<Card
						link={'/employees'}
						icon={<BsPerson fontSize={'20px'} />}
						title={'Total employees'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataTotalEmployees?.totalEmployees || 0}
					/>
					<Card
						link={'/projects'}
						icon={<AiOutlineProject fontSize={'20px'} />}
						title={'Total projects'}
						bg={'hu-Pink.lightH'}
						borderColor={'hu-Pink.normal'}
						text={dataTotalProjects?.totalProjects || 0}
					/>
					<Card
						link={'/projects'}
						icon={<AiOutlineProject fontSize={'20px'} />}
						title={'Overdue projects'}
						bg={'hu-Lam.lightH'}
						borderColor={'hu-Lam.normal'}
						text={dataCountProjectsOverdue?.countProjectsOverdue || 0}
					/>
					<Card
						link={'/time-logs'}
						icon={<BiTimeFive fontSize={'20px'} />}
						title={'Hours logged'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={`${dataHoursLoged?.hoursLogged || 0} Hrs`}
					/>
					<Card
						link={'/tasks'}
						icon={<VscTasklist fontSize={'20px'} />}
						title={'Pending tasks'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataPendingTasks?.pendingTasks || 0}
					/>
					<Card
						link={'/attendance'}
						icon={<AiOutlineCheck fontSize={'20px'} />}
						title={'Today Attendance'}
						bg={'hu-Pink.lightH'}
						borderColor={'hu-Pink.normal'}
						text={dataTodayAttendance?.todayAttendance || 0}
					/>
					<Card
						link={'/contracts'}
						icon={<GrDocumentText fontSize={'20px'} />}
						title={'Contracts senerated'}
						bg={'hu-Lam.lightH'}
						borderColor={'hu-Lam.normal'}
						text={dataContractsGenerated?.contractsGenerated || 0}
					/>
					<Card
						link={'/contracts'}
						icon={<GrDocumentText fontSize={'20px'} />}
						title={'Contracts signed'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataContractsSigned?.contractsSigned || 0}
					/>
				</Grid>
			</Collapse>
			<Grid
				w={'full'}
				templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']}
				gap={6}
			>
				<ItemDashboard title="Earnings">
					<>
						{dataProjectsEarning && (
							<Bar
								isMoney={true}
								isShowLabel
								colors={['#00A991']}
								labels={dataProjectsEarning.sumEarningLoggedProjects.map(
									(e: any) => {
										return e.name
									}
								)}
								data={
									dataProjectsEarning.sumEarningLoggedProjects.map((e: any) => {
										return e.sum
									}) as number[]
								}
								height={260}
							/>
						)}
					</>
				</ItemDashboard>

				<ItemDashboard title="Status Wise Projects">
					<>
						{dataStatusWiseProjects && (
							<Donut
								colors={dataStatusWiseProjects.statusWiseProjects.map(
									(item: { count: number; project_status: string }) => {
										switch (item.project_status) {
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
									}
								)}
								data={dataStatusWiseProjects.statusWiseProjects.map((item: any) => {
									return Number(item.count)
								})}
								height={300}
								labels={dataStatusWiseProjects.statusWiseProjects.map(
									(item: any) => {
										return item.project_status
									}
								)}
							/>
						)}
					</>
				</ItemDashboard>

				<ItemDashboard
					title="Client Wise Timelogs"
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
				>
					{dataClientWiseTimeLogs && (
						<Line
							height={280}
							data={dataClientWiseTimeLogs.clientWiseTimeLogs.map((item: any) =>
								Number(item.total_hours)
							)}
							labels={dataClientWiseTimeLogs.clientWiseTimeLogs.map(
								(item: any) => item.name
							)}
							colors={['#00A991']}
							title={'Time log'}
						/>
					)}
				</ItemDashboard>

				<ItemDashboard
					title="Client Wise Earnings"
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
				>
					<>
						{dataClientWiseEarnings && (
							<Bar
								isMoney={true}
								isShowLabel
								colors={['#FFAAA7']}
								labels={dataClientWiseEarnings.clientWiseEarnings.map((e: any) => {
									return e.name
								})}
								data={
									dataClientWiseEarnings.clientWiseEarnings.map((e: any) => {
										return e.earnings
									}) as number[]
								}
								height={260}
							/>
						)}
					</>
				</ItemDashboard>

				<ItemDashboard
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
					title="Attendance and leave"
				>
					<>
						{dataCountByDateAttendance && dataCountByDateLeave && (
							<Area
								labels={dataCountByDateAttendance.countBydateAttendance.map(
									(e: any) => {
										return e.date
									}
								)}
								height={260}
								colors={['#00A991', '#FFAAA7']}
								data={[
									{
										name: 'Attendance',
										data: dataCountByDateAttendance.countBydateAttendance.map(
											(e: any) => {
												return e.count
											}
										),
									},
									{
										name: 'Leave',
										data: dataCountByDateLeave.countByLeaveAttendance.map(
											(e: any) => {
												return e.count
											}
										),
									},
								]}
							/>
						)}
					</>
				</ItemDashboard>

				<ItemDashboard
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
					title="Pending Milestone"
					overflow={'auto'}
				>
					<TableContainer w={'full'}>
						<Table w={'full'} variant="simple">
							<Thead>
								<Tr>
									<Th>#</Th>
									<Th>Title</Th>
									<Th>Project</Th>
									<Th isNumeric>Cost</Th>
								</Tr>
							</Thead>
							<Tbody w={'full'}>
								{dataPendingMilestone &&
									dataPendingMilestone.pendingMilestone.map(
										(item: any, key: number) => {
											return (
												<Tr key={key}>
													<Td>{key}</Td>
													<Td whiteSpace={'normal'}>{item.title}</Td>
													<Td whiteSpace={'normal'}>{item.name}</Td>
													<Td isNumeric>{item.cost}</Td>
												</Tr>
											)
										}
									)}
							</Tbody>
						</Table>
					</TableContainer>
				</ItemDashboard>

				<ItemDashboard
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
					title="Latest Clients"
					overflow={'auto'}
				>
					<TableContainer w={'full'}>
						<Table w={'full'} variant="simple">
							<Thead>
								<Tr>
									<Th>Client</Th>
									<Th>Gender</Th>
									<Th isNumeric>Create</Th>
								</Tr>
							</Thead>
							<Tbody w={'full'}>
								{dataLastestClients &&
									dataLastestClients.lastestClients.map(
										(item: clientType, key: number) => {
											return (
												<Tr key={key}>
													<Td>
														<HStack spacing={5}>
															<Avatar
																flex={'none'}
																size={'sm'}
																name={item.name}
																src={item.avatar?.url}
															/>
															<VStack alignItems={'start'}>
																<Text>{item.name}</Text>
																<Text
																	isTruncated
																	w={'full'}
																	fontSize={'sm'}
																	color={'gray.400'}
																>
																	{item.company_name}
																</Text>
															</VStack>
														</HStack>
													</Td>
													<Td whiteSpace={'normal'}>{item.gender}</Td>
													<Td isNumeric>{`${new Date(
														item.createdAt
													).getDate()}-${
														new Date(item.createdAt).getMonth() + 1
													}-${new Date(
														item.createdAt
													).getFullYear()}`}</Td>
												</Tr>
											)
										}
									)}
							</Tbody>
						</Table>
					</TableContainer>
				</ItemDashboard>

				<ItemDashboard
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
					title="Pending tasks"
					overflow={'auto'}
				>
					<VStack
						spacing={5}
						w={'full'}
						divider={<StackDivider />}
						alignItems={'start'}
						justifyContent={'start'}
					>
						{dataPendingTasksRaw &&
							dataPendingTasksRaw.pendingTasksRaw.map((item, key) => {
								return (
									<HStack
										key={key}
										spacing={5}
										w={'full'}
										pos={'relative'}
										justifyContent={'space-between'}
									>
										<Box w={'full'} flex={'1'}>
											<Text
												onClick={() => {
													setTaskId(item.id)
													onOpenDetailTask()
												}}
												_hover={{
													textDecoration: 'underline',
													cursor: 'pointer',
												}}
												fontWeight={'semibold'}
											>
												{item.name}
											</Text>

											<Text color={'gray'} fontSize={'14px'}>
												{item.project.name}
											</Text>
										</Box>
										<HStack spacing={5}>
											<Tooltip
												hasArrow
												label={item.assignBy.name}
												bg="gray.300"
												color="black"
											>
												<Link
													passHref
													href={`/employees/${item.assignBy.id}/detail`}
												>
													<Box
														display={[
															'none',
															null,
															null,
															null,
															null,
															'block',
														]}
														cursor={'pointer'}
													>
														<Avatar
															size={'sm'}
															name={item.assignBy.name}
															src={item.assignBy.avatar?.url}
														/>
													</Box>
												</Link>
											</Tooltip>
											<Text color={'red.500'}>
												{' '}
												{`${new Date(item.deadline).getDate()}-${
													new Date(item.deadline).getMonth() + 1
												}-${new Date(item.deadline).getFullYear()}`}
											</Text>
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
										</HStack>
									</HStack>
								)
							})}
					</VStack>
				</ItemDashboard>

				<ItemDashboard
					alert={`1-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()} to ${new Date().getDate()}-${
						new Date().getMonth() + 1
					}-${new Date().getFullYear()}`}
					title="Pending leaves"
					overflow={'auto'}
				>
					<VStack
						spacing={5}
						w={'full'}
						divider={<StackDivider />}
						alignItems={'start'}
						justifyContent={'start'}
					>
						{dataPendingLeavesRaw &&
							dataPendingLeavesRaw.pendingLeavesRaw.map((item: any, key: number) => {
								return (
									<HStack
										key={key}
										spacing={5}
										w={'full'}
										pos={'relative'}
										justifyContent={'space-between'}
									>
										<HStack spacing={5}>
											<Avatar
												flex={'none'}
												size={'sm'}
												name={item.employee_name}
												src={item.url}
											/>
											<VStack alignItems={'start'}>
												<Text>
													{item.employee_name}
													{currentUser?.email == item.email && (
														<Badge
															marginLeft={'5'}
															color={'white'}
															background={'gray.500'}
														>
															It's you
														</Badge>
													)}
												</Text>
												<Text
													isTruncated
													w={'full'}
													fontSize={'sm'}
													color={'gray.400'}
												>
													{item.role}
												</Text>
											</VStack>
										</HStack>

										<HStack spacing={5}>
											<Text isTruncated>
												{`${new Date(item.date).getDate()}-${
													new Date(item.date).getMonth() + 1
												}-${new Date(item.date).getFullYear()}`}
											</Text>
											<HStack
												display={['none', null, null, null, 'flex']}
												alignItems={'center'}
												justifyContent={'center'}
											>
												<Box
													w={'10px'}
													borderRadius={'full'}
													h={'10px'}
													bg={item.color_code}
												/>
												<Text>{item.leave_type_name}</Text>
											</HStack>
											<Menu>
												<MenuButton as={Button} paddingInline={3}>
													<MdOutlineMoreVert />
												</MenuButton>
												<MenuList>
													<MenuItem
														onClick={() => {
															setLeaveId(item.leave_id)
															onOpenDetail()
														}}
														icon={<IoEyeOutline fontSize={'15px'} />}
													>
														View
													</MenuItem>

													<MenuItem
														onClick={() => {
															mutateUpdateStatus({
																status: 'Approved',
																leaveId: item.leave_id,
															})
														}}
														icon={<BsCheck2 fontSize={'15px'} />}
													>
														Approve
													</MenuItem>
													<MenuItem
														onClick={() => {
															mutateUpdateStatus({
																status: 'Rejected',
																leaveId: item.leave_id,
															})
														}}
														icon={<IoMdClose fontSize={'15px'} />}
													>
														Reject
													</MenuItem>
												</MenuList>
											</Menu>
										</HStack>
									</HStack>
								)
							})}
					</VStack>
				</ItemDashboard>
			</Grid>
			{/* drawer to detail leave */}
			<Drawer size="md" title="Detail leave" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailLeave leaveId={leaveId} />
			</Drawer>

			<Drawer
				size="xl"
				title={`Task #${taskId}`}
				onClose={onCloseDetailTask}
				isOpen={isOpenDetailTask}
			>
				<DetailTask taskIdProp={taskId} onCloseDrawer={onCloseDetailTask} />
			</Drawer>
		</Box>
	)
}

dashboard.getLayout = ClientLayout
export default dashboard
