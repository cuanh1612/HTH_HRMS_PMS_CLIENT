import {
	Avatar,
	Badge,
	Box,
	Button,
	Collapse,
	Grid,
	GridItem,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	StackDivider,
	Text,
	Tooltip,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'

import { Area, Bar } from 'components/charts'
import { Card } from 'components/common'
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
	hoursLoggedQuery,
	lastestClientsQuery,
	pendingLeavesRawQuery,
	pendingMilestoneQuery,
	pendingTasksQuery,
	pendingTasksRawQuery,
	projectsEarningQuery,
	projectsHoursLoggedQuery,
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
import { BsCheck2, BsInfoCircle, BsPerson } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineMoreVert } from 'react-icons/md'
import { VscTasklist } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import DetailLeave from './leaves/[leaveId]'
import DetailTask from './tasks/[taskId]'

const dashboard: NextLayout = () => {
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
	const { data: dataPendingTasksRaw } = pendingTasksRawQuery(isAuthenticated)
	const { data: dataPendingLeavesRaw, mutate: refetchDataPendingLeavesRaw } =
		pendingLeavesRawQuery(isAuthenticated)
	const { data: dataHoursLooged } = hoursLoggedQuery(isAuthenticated)
	const { data: dataStatusWiseProjects } = statusWiseProjects(isAuthenticated)
	const { data: dataContractsGenerated } = contractsGeneratedQuery(isAuthenticated)
	const { data: dataPendingMilestone } = pendingMilestoneQuery(isAuthenticated)
	const { data: dataContractsSigned } = contractsSignedQuery(isAuthenticated)
	const { data: dataClientWiseEarnings } = clientWiseEarningsQuery(isAuthenticated)
	const { data: dataClientWiseTimeLogs } = clientWiseTimeLogsQuery(isAuthenticated)
	const { data: dataLastestClients } = lastestClientsQuery(isAuthenticated)
	const { data: dataProjectsEarning } = projectsEarningQuery(isAuthenticated)
	const { data: dataProjectsHoursLogged } = projectsHoursLoggedQuery(isAuthenticated)
	const { data: dataCountByDateAttendance } = countByDateAttendanceQuery(isAuthenticated)
	const { data: dataCountByDateLeave } = countByDateLeaveQuery(isAuthenticated)

	console.log(dataCountByDateLeave)

	// mutation ----------------------------------------
	// update status of leave
	const [mutateUpdateStatus, { status: statusUpStatus }] = updateStatusMutation(setToast)

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

	// alert when update status success
	useEffect(() => {
		if (statusUpStatus == 'success') {
			setToast({
				type: 'success',
				msg: 'Update leave successfully',
			})
			refetchDataPendingLeavesRaw()
		}
	}, [statusUpStatus])

	return (
		<Box w={'100%'} pos={'relative'}>
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
						icon={<BsPerson fontSize={'20px'} />}
						title={'Total clients'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataTotalClients?.totalClients || 0}
					/>
					<Card
						icon={<BsPerson fontSize={'20px'} />}
						title={'Total employees'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataTotalEmployees?.totalEmployees || 0}
					/>
					<Card
						icon={<AiOutlineProject fontSize={'20px'} />}
						title={'Total projects'}
						bg={'hu-Pink.lightH'}
						borderColor={'hu-Pink.normal'}
						text={dataTotalProjects?.totalProjects || 0}
					/>
					<Card
						icon={<BiTimeFive fontSize={'20px'} />}
						title={'Hours logged'}
						bg={'hu-Lam.lightH'}
						borderColor={'hu-Lam.normal'}
						text={`${dataHoursLooged?.hoursLogged || 0} Hrs`}
					/>
					<Card
						icon={<VscTasklist fontSize={'20px'} />}
						title={'Pending tasks'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataPendingTasks?.pendingTasks || 0}
					/>
					<Card
						icon={<AiOutlineCheck fontSize={'20px'} />}
						title={'Today Attendance'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataTodayAttendance?.todayAttendance || 0}
					/>
				</Grid>
			</Collapse>
			<Grid
				w={'full'}
				templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']}
				gap={6}
			>
				<GridItem pos={'relative'}>
					<VStack spacing={'4'} alignItems={'start'} w={'full'}>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
							Earnings
						</Text>

						<Box
							id={'hoang'}
							w={'full'}
							padding={'20px'}
							border={'2px solid'}
							borderColor={'hu-Green.normal'}
							borderRadius={'10px'}
							h={'300px'}
						>
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
										dataProjectsEarning.sumEarningLoggedProjects.map(
											(e: any) => {
												return e.sum
											}
										) as number[]
									}
									height={260}
								/>
							)}
						</Box>
					</VStack>
				</GridItem>

				<GridItem pos={'relative'}>
					<VStack spacing={'4'} alignItems={'start'} w={'full'}>
						<HStack justifyContent={'center'} alignItems={'center'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Attendance and leave
							</Text>
							<Tooltip
								hasArrow
								label={`1-${
									new Date().getMonth() + 1
								}-${new Date().getFullYear()} to ${new Date().getDate()}-${
									new Date().getMonth() + 1
								}-${new Date().getFullYear()}`}
								bg="gray.300"
								color="black"
							>
								<Box pt={'5px'}>
									<BsInfoCircle />
								</Box>
							</Tooltip>
						</HStack>
						<Box
							id={'hoang'}
							w={'full'}
							padding={'20px'}
							border={'2px solid'}
							borderColor={'hu-Green.normal'}
							borderRadius={'10px'}
							h={'300px'}
						>
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
						</Box>
					</VStack>
				</GridItem>

				<GridItem pos={'relative'}>
					<VStack spacing={'4'} alignItems={'start'} w={'full'}>
						<HStack justifyContent={'center'} alignItems={'center'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Pending tasks
							</Text>
							<Tooltip
								hasArrow
								label={`1-${
									new Date().getMonth() + 1
								}-${new Date().getFullYear()} to ${new Date().getDate()}-${
									new Date().getMonth() + 1
								}-${new Date().getFullYear()}`}
								bg="gray.300"
								color="black"
							>
								<Box pt={'5px'}>
									<BsInfoCircle />
								</Box>
							</Tooltip>
						</HStack>
						<Box
							id={'hoang'}
							w={'full'}
							padding={'20px'}
							border={'2px solid'}
							borderColor={'hu-Green.normal'}
							borderRadius={'10px'}
							h={'300px'}
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
													<Text onClick={()=> {
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
						</Box>
					</VStack>
				</GridItem>

				<GridItem pos={'relative'}>
					<VStack spacing={'4'} alignItems={'start'} w={'full'}>
						<HStack justifyContent={'center'} alignItems={'center'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Pending leaves
							</Text>
							<Tooltip
								hasArrow
								label={`1-${
									new Date().getMonth() + 1
								}-${new Date().getFullYear()} to ${new Date().getDate()}-${
									new Date().getMonth() + 1
								}-${new Date().getFullYear()}`}
								bg="gray.300"
								color="black"
							>
								<Box pt={'5px'}>
									<BsInfoCircle />
								</Box>
							</Tooltip>
						</HStack>
						<Box
							id={'hoang'}
							w={'full'}
							padding={'20px'}
							border={'2px solid'}
							borderColor={'hu-Green.normal'}
							borderRadius={'10px'}
							h={'300px'}
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
									dataPendingLeavesRaw.pendingLeavesRaw.map(
										(item: any, key: number) => {
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
																{currentUser?.email ==
																	item.email && (
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
															display={[
																'none',
																null,
																null,
																null,
																'flex',
															]}
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
															<MenuButton
																as={Button}
																paddingInline={3}
															>
																<MdOutlineMoreVert />
															</MenuButton>
															<MenuList>
																<MenuItem
																	onClick={() => {
																		setLeaveId(item.leave_id)
																		onOpenDetail()
																	}}
																	icon={
																		<IoEyeOutline
																			fontSize={'15px'}
																		/>
																	}
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
																	icon={
																		<BsCheck2
																			fontSize={'15px'}
																		/>
																	}
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
																	icon={
																		<IoMdClose
																			fontSize={'15px'}
																		/>
																	}
																>
																	Reject
																</MenuItem>
															</MenuList>
														</Menu>
													</HStack>
												</HStack>
											)
										}
									)}
							</VStack>
						</Box>
					</VStack>
				</GridItem>
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
