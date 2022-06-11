import { Avatar, Container, Divider, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import {
	allTasksByEmployeeQuery,
	countProjectsEmployeeQuery,
	detailEmployeeQuery,
	hoursLoggedEmployeeQuery,
	lateAttendanceEmployeeQuery,
	leavesTakenEmployeeQuery,
	openTasksEmployeeQuery,
} from 'queries'
import { useContext, useEffect } from 'react'
import { AiOutlineProject } from 'react-icons/ai'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { SWRConfig } from 'swr'
import { authMutaionResponse, employeeMutaionResponse } from 'type/mutationResponses'

export default function DetailEmployee({dataDetailEmployee} : {dataDetailEmployee: employeeMutaionResponse}) {
	// const { isOpen, onOpen, onClose } = useDisclosure()
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	//Query -------------------------------------------------------------------------------------------------
	const { data: dataEmployee } = detailEmployeeQuery(isAuthenticated, employeeId as string)

	const { data: openTasksEmployee } = openTasksEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

	const { data: hoursLoggedEmployee } = hoursLoggedEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

	const { data: countProjectsEmployee } = countProjectsEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

	const { data: countLateAttendancesEmployee } = lateAttendanceEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

	const { data: countLeavesTakenEmployee } = leavesTakenEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

	const { data: allTasks } = allTasksByEmployeeQuery(isAuthenticated, employeeId as string)

	//mutation ----------------------------------------------------------------------------------------------

	//function-------------------------------------------------------------------

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
					fallback: {[urlDetailEmployee] : dataDetailEmployee},
				}}
			>
				<Container maxW="full" bg="#f2f4f7" h={'full'} minH={'100vh'}>
					<VStack spacing={6} py={6} px={4}>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
							<GridItem colSpan={[2, 2, 2, 1]}>
								<VStack spacing={6}>
									<HStack
										bg="white"
										p={'20px'}
										boxShadow={'0 0 4px 0 #e8eef3'}
										borderRadius={5}
										w={'full'}
										spacing={5}
										position={'relative'}
									>
										<Avatar
											boxSize={32}
											borderRadius={5}
											name={dataEmployee?.employee?.name}
											src={dataEmployee?.employee?.avatar?.url}
										/>
										<VStack spacing={2} align={'start'} h={'full'} w={'full'}>
											<Text fontWeight={'semibold'}>
												{dataEmployee?.employee?.name}
											</Text>
											<Text color={'gray.400'}>
												{dataEmployee?.employee?.designation?.name} +{' '}
												{dataEmployee?.employee?.department?.name}
											</Text>
											<Divider />
											<Grid
												templateColumns="repeat(3, 1fr)"
												gap={6}
												w={'full'}
											>
												<GridItem colSpan={[3, 3, 3, 3, 1]}>
													<Text>Open Task</Text>
													<Text fontWeight={'semibold'} fontSize={20}>
														{openTasksEmployee?.countOpentasks || '0'}
													</Text>
												</GridItem>

												<GridItem colSpan={[3, 3, 3, 3, 1]}>
													<Text>Projects</Text>
													<Text fontWeight={'semibold'} fontSize={20}>
														{countProjectsEmployee?.countProjects ||
															'0'}
													</Text>
												</GridItem>

												<GridItem colSpan={[3, 3, 3, 3, 1]}>
													<Text>Hours Logged</Text>
													<Text fontWeight={'semibold'} fontSize={20}>
														{hoursLoggedEmployee?.hoursLogged || '0'}
													</Text>
												</GridItem>
											</Grid>
										</VStack>
									</HStack>

									<Grid
										templateColumns="repeat(3, 1fr)"
										gap={6}
										w={'full'}
										bg="white"
										p={'20px'}
										boxShadow={'0 0 4px 0 #e8eef3'}
										borderRadius={5}
										position={'relative'}
									>
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
											<Text>
												{dataEmployee?.employee?.joining_date || '--'}
											</Text>
										</GridItem>
										<GridItem colSpan={[3, 1]}>
											<Text color={'gray.400'}>Date Of Birth</Text>
										</GridItem>
										<GridItem colSpan={[3, 2]}>
											<Text>
												{dataEmployee?.employee?.date_of_birth || '--'}
											</Text>
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
							</GridItem>

							<GridItem colSpan={[2, 2, 2, 1]}>
								<VStack spacing={6}>
									<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
										<GridItem
											colSpan={[2, 2, 1]}
											bg="white"
											p={'20px'}
											boxShadow={'0 0 4px 0 #e8eef3'}
											borderRadius={5}
										>
											<HStack
												h={'full'}
												w={'full'}
												justifyContent={'space-between'}
											>
												<VStack h={'full'} align={'start'}>
													<Text fontWeight={'semibold'}>
														Late Attendance
													</Text>
													<Text fontWeight={'semibold'} color={'#1d82f5'}>
														{countLateAttendancesEmployee?.lateAttendance ||
															'0'}
													</Text>
												</VStack>

												<VStack
													h={'full'}
													justify={'center'}
													color={'gray.400'}
												>
													<AiOutlineProject fontSize={24} />
												</VStack>
											</HStack>
										</GridItem>

										<GridItem
											colSpan={[2, 2, 1]}
											bg="white"
											p={'20px'}
											boxShadow={'0 0 4px 0 #e8eef3'}
											borderRadius={5}
										>
											<HStack
												h={'full'}
												w={'full'}
												justifyContent={'space-between'}
											>
												<VStack h={'full'} align={'start'}>
													<Text fontWeight={'semibold'}>
														Total Earnings
													</Text>
													<Text fontWeight={'semibold'} color={'#1d82f5'}>
														{countLeavesTakenEmployee?.countLeavesTaken ||
															'0'}
													</Text>
												</VStack>

												<VStack
													h={'full'}
													justify={'center'}
													color={'gray.400'}
												>
													<FaRegMoneyBillAlt fontSize={24} />
												</VStack>
											</HStack>
										</GridItem>

										<GridItem
											colSpan={[2]}
											bg="white"
											p={'20px'}
											boxShadow={'0 0 4px 0 #e8eef3'}
											borderRadius={5}
										></GridItem>

										<GridItem
											colSpan={[2]}
											bg="white"
											p={'20px'}
											boxShadow={'0 0 4px 0 #e8eef3'}
											borderRadius={5}
										></GridItem>
									</Grid>
								</VStack>
							</GridItem>
						</Grid>
					</VStack>
				</Container>
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
		props: {dataDetailEmployee: queryEmployee}, // will be passed to the page component as props
	}
}
