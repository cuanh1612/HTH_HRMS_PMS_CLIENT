import {
	Avatar,
	Box,
	Grid,
	GridItem,
	HStack,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react'
import { Donut } from 'components/charts'
import { ClientLayout } from 'components/layouts'
import { EmployeeLayout } from 'components/layouts/Employee'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import {
	allTasksByEmployeeQuery,
	countProjectsEmployeeQuery,
	countTasksStatusEmployeeQuery,
	detailEmployeeQuery,
	hoursLoggedEmployeeQuery,
	lateAttendanceEmployeeQuery,
	leavesTakenEmployeeQuery,
	openTasksEmployeeQuery,
} from 'queries'
import { useContext, useEffect } from 'react'
import { AiOutlineProject } from 'react-icons/ai'
import { SWRConfig } from 'swr'
import { NextLayout } from 'type/element/layout'
import { authMutaionResponse, employeeMutaionResponse } from 'type/mutationResponses'

export const DetailEmployee: NextLayout | any = ({
	dataDetailEmployee,
	employeeIdProp
}: {
	dataDetailEmployee: employeeMutaionResponse,
	employeeIdProp?: string | number
}) => {
	// const { isOpen, onOpen, onClose } = useDisclosure()
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	//Query -------------------------------------------------------------------------------------------------
	const { data: dataEmployee } = detailEmployeeQuery(isAuthenticated, employeeId as string)

	const { data: openTasksEmployee } = openTasksEmployeeQuery(
		isAuthenticated,
		employeeId as string || employeeIdProp
	)

	const { data: hoursLoggedEmployee } = hoursLoggedEmployeeQuery(
		isAuthenticated,
		employeeId as string || employeeIdProp
	)

	const { data: countProjectsEmployee } = countProjectsEmployeeQuery(
		isAuthenticated,
		employeeId as string || employeeIdProp
	)

	const { data: countLateAttendancesEmployee } = lateAttendanceEmployeeQuery(
		isAuthenticated,
		employeeId as string || employeeIdProp
	)

	const { data: countTasksStatus } = countTasksStatusEmployeeQuery(
		isAuthenticated,
		employeeId as string || employeeIdProp
	)



	const { data: countLeavesTakenEmployee } = leavesTakenEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

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

	//Url initial query detail employee
	const urlDetailEmployee = `employees/${employeeId}`

	return (
		<>
			<SWRConfig
				value={{
					fallback: { [urlDetailEmployee]: dataDetailEmployee },
				}}
			>
				<Box w="full">
					<VStack spacing={5} alignItems={'start'} w={'full'}>
						<HStack spacing={5} h={'full'} w={'full'}>
							<Avatar
								name={dataDetailEmployee?.employee?.name}
								src={dataDetailEmployee?.employee?.avatar?.url}
								size={'xl'}
							/>
							<VStack spacing={'1px'} align={'start'} height={'full'}>
								<Text fontSize={'20px'} fontWeight={'semibold'}>
									{dataDetailEmployee?.employee?.name}
								</Text>
								<Text color={'gray.400'}>{dataDetailEmployee?.employee?.role}</Text>
							</VStack>
						</HStack>

						<Stack
							direction={['column', null, null, null, 'row']}
							alignItems={'start'}
							spacing={5}
							w={'full'}
						>
							<VStack w={'400px'} minW={'400px'} alignItems={'start'} spacing={4}>
								<Text fontWeight={'semibold'} fontSize={'20px'}>
									Profile Info
								</Text>
								<Grid templateColumns="repeat(3, 1fr)" gap={6} w={'full'}>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Employee ID</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.employeeId}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Full Name</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.name}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Email</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.email}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Designation</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataEmployee?.employee?.designation?.name || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Department</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataEmployee?.employee?.department?.name || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Mobile</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.mobile || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Gender</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.gender || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Joining Date</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.joining_date || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Date Of Birth</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.date_of_birth || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Hourly Rate</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.hourly_rate}$</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Address</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataEmployee?.employee?.address || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Skill</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataEmployee?.employee?.skills?.toString() || '--'}
										</Text>
									</GridItem>
								</Grid>
							</VStack>

							<VStack alignItems={'start'} spacing={10} w={'full'}>
								<VStack alignItems={'start'} spacing={4} w={'full'}>
									<Text fontWeight={'semibold'} fontSize={'20px'}>
										Static
									</Text>
									<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
										<GridItem
											colSpan={[2, null, null, null, null, 1]}
											p={'20px'}
											borderBottom={'3px solid'}
											borderColor={'hu-Green.normal'}
										>
											<HStack
												w="full"
												justifyContent={'space-between'}
												spacing={5}
											>
												<HStack spacing={5}>
													<HStack
														justifyContent={'center'}
														borderRadius={5}
														bg={'hu-Green.lightA'}
														color={'hu-Green.normal'}
														w={'40px'}
														h={'40px'}
													>
														<AiOutlineProject fontSize={20} />
													</HStack>
													<Text>Open Tasks</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{openTasksEmployee?.countOpentasks || 0}
												</Text>
											</HStack>
										</GridItem>

										<GridItem
											colSpan={[2, null, null, null, null, 1]}
											p={'20px'}
											borderBottom={'3px solid'}
											borderColor={'hu-Pink.normal'}
										>
											<HStack
												justifyContent={'space-between'}
												spacing={5}
												h={'full'}
											>
												<HStack spacing={5}>
													<HStack
														justifyContent={'center'}
														borderRadius={5}
														bg={'hu-Pink.lightA'}
														color={'hu-Pink.normal'}
														w={'40px'}
														h={'40px'}
													>
														<AiOutlineProject fontSize={20} />
													</HStack>
													<Text>Projects</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{countProjectsEmployee?.countProjects || 0}
												</Text>
											</HStack>
										</GridItem>

										<GridItem
											colSpan={[2, null, null, null, null, 1]}
											p={'20px'}
											borderBottom={'3px solid'}
											borderColor={'hu-Pink.normal'}
										>
											<HStack
												justifyContent={'space-between'}
												spacing={5}
												h={'full'}
											>
												<HStack spacing={5}>
													<HStack
														justifyContent={'center'}
														borderRadius={5}
														bg={'hu-Pink.lightA'}
														color={'hu-Pink.normal'}
														w={'40px'}
														h={'40px'}
													>
														<AiOutlineProject fontSize={20} />
													</HStack>
													<Text>Hours Logged</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{hoursLoggedEmployee?.hoursLogged || 0}
												</Text>
											</HStack>
										</GridItem>

										<GridItem
											colSpan={[2, null, null, null, null, 1]}
											p={'20px'}
											borderBottom={'3px solid'}
											borderColor={'hu-Pink.normal'}
										>
											<HStack
												justifyContent={'space-between'}
												spacing={5}
												h={'full'}
											>
												<HStack spacing={5}>
													<HStack
														justifyContent={'center'}
														borderRadius={5}
														bg={'hu-Pink.lightA'}
														color={'hu-Pink.normal'}
														w={'40px'}
														h={'40px'}
													>
														<AiOutlineProject fontSize={20} />
													</HStack>
													<Text>Late Attendance</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{countLateAttendancesEmployee?.lateAttendance ||
														0}
												</Text>
											</HStack>
										</GridItem>

										<GridItem
											colSpan={[2, null, null, null, null, 1]}
											p={'20px'}
											borderBottom={'3px solid'}
											borderColor={'hu-Pink.normal'}
										>
											<HStack
												justifyContent={'space-between'}
												spacing={5}
												h={'full'}
											>
												<HStack spacing={5}>
													<HStack
														justifyContent={'center'}
														borderRadius={5}
														bg={'hu-Pink.lightA'}
														color={'hu-Pink.normal'}
														w={'40px'}
														h={'40px'}
													>
														<AiOutlineProject fontSize={20} />
													</HStack>
													<Text>Late Attendance</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{countLeavesTakenEmployee?.countLeavesTaken ||
														0}
												</Text>
											</HStack>
										</GridItem>
									</Grid>
								</VStack>
								<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
									<GridItem
										colSpan={[2, null, null, null, null, 1]}
										borderRadius={5}
									>
										<VStack spacing={'4'} alignItems={'start'} w={'full'}>
											<Text fontWeight={'semibold'} fontSize={'xl'}>
												Tasks
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
												{countTasksStatus?.countProjects && (
													<Donut
														labels={countTasksStatus.countProjects.map(task=> {
															return task.title
														})}
														colors={countTasksStatus.countProjects.map(task=> {
															return task.color
														})}
														data={countTasksStatus.countProjects.map(task=> {
															return Number(task.count)
														})}
														height={280}
													/>
												)}
											</Box>
										</VStack>
									</GridItem>
								</Grid>
							</VStack>
						</Stack>
					</VStack>
				</Box>
			</SWRConfig>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const res: authMutaionResponse = await fetch('http://localhost:4000/api/auth/refresh_token', {
		headers: context.req.headers as HeadersInit,
	}).then((result) => result.json())

	//get detail employee
	const queryEmployee: employeeMutaionResponse = await fetch(
		`http://localhost:4000/api/employees/${context.query.employeeId}`,
		{
			headers: {
				Authorization: `bearer ${res.accessToken}`,
				...(context.req.headers as HeadersInit),
			},
		}
	).then((result) => result.json())

	if (!queryEmployee.employee) {
		return {
			notFound: true,
		}
	}

	return {
		props: { dataDetailEmployee: queryEmployee }, // will be passed to the page component as props
	}
}
DetailEmployee.getLayout = EmployeeLayout
export default DetailEmployee
