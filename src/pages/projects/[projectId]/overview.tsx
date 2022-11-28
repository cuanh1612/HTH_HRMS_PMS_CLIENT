import {
	Avatar,
	Box,
	Grid,
	GridItem,
	HStack,
	Progress,
	SimpleGrid,
	Stack,
	Text,
	Tooltip as CTooltip,
	useBreakpoint,
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import {
	countStatusTasksQuery,
	detailProjectQuery,
	projectEarningsQuery,
	projectHoursLoggedQuery,
} from 'queries'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import { ProjectLayout } from 'components/layouts'
import { Empty, Head, StatisticPrj } from 'components/common'
import { Bar, Donut } from 'components/charts'

import { allActivitiesByProjectQuery } from 'queries/ProjectActivity'
import { FiGitCommit } from 'react-icons/fi'

const Overview: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query
	const { colorMode } = useColorMode()
	const breakpoint = useBreakpoint()

	//query ----------------------------------------------------------------------
	// get detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)
	const { data: dataEarning } = projectEarningsQuery(isAuthenticated, projectId as string)
	const { data: dataHoursLogged } = projectHoursLoggedQuery(isAuthenticated, projectId as string)
	const { data: dataCountStatus } = countStatusTasksQuery(isAuthenticated, projectId as string)
	//all activities for project
	const { data: allActs } = allActivitiesByProjectQuery(isAuthenticated, projectId)

	//User effect ---------------------------------------------------------------
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

	return (
		<Stack
			pb={8}
			direction={
				breakpoint && ['2xl', 'xl', 'lg', 'md'].includes(breakpoint) ? 'row' : 'column'
			}
			spacing={'30px'}
		>
			<Head title={dataDetailProject?.project?.name} />
			<VStack spacing={5} flex={1}>
				<VStack spacing={'4'} w={'full'} alignItems={'start'}>
					<Text fontWeight={'semibold'} fontSize={'xl'}>
						Statistics
					</Text>
					<SimpleGrid w={'full'} minChildWidth="250px" spacing="5">
						<StatisticPrj
							title="Project Budget"
							decorate="🌔"
							isMoney
							content={dataDetailProject?.project?.project_budget || 0}
						/>
						<StatisticPrj
							title="Earnings"
							decorate="🌓"
							isMoney
							content={dataEarning?.projectEarnings || 0}
						/>
						<StatisticPrj
							title="Hours Logged"
							decorate="🌖"
							content={dataHoursLogged?.projectHoursLogged || 0}
						/>
					</SimpleGrid>
				</VStack>
				<Grid w={'full'} templateColumns="repeat(2, 1fr)" gap={5}>
					<GridItem
						pos={'relative'}
						overflow={'hidden'}
						colSpan={[2, null, null, null, null, 1]}
					>
						<VStack spacing={'4'} alignItems={'start'} w={'full'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Tasks
							</Text>
							<Box
								id={'hoang'}
								w={'full'}
								padding={'20px'}
								bg={colorMode == 'light'? '#fafafa': '#1e2636'}
								borderRadius={'10px'}
								h={'300px'}
							>
								{dataCountStatus?.countstatusTasks.some(
									(value) => value.count != 0
								) ? (
									<Donut
										labels={dataCountStatus.countstatusTasks.map(
											(e) => e.title
										)}
										colors={dataCountStatus.countstatusTasks.map(
											(e) => `${e.color}`
										)}
										data={
											dataCountStatus.countstatusTasks.map((e) =>
												Number(e.count)
											) as number[]
										}
										height={280}
									/>
								) : (
									<Empty height={'220px '} />
								)}
							</Box>
						</VStack>
					</GridItem>
					<GridItem
						pos={'relative'}
						colSpan={[2, null, null, null, null, 1]}
						overflow={'hidden'}
					>
						<VStack spacing={'4'} alignItems={'start'} w={'full'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Info project
							</Text>
							<VStack
								w={'full'}
								padding={'20px'}
								bg={colorMode == 'light'? '#fafafa': '#1e2636'}
								borderRadius={'10px'}
								h={'300px'}
								alignItems={'start'}
								spacing={5}
							>
								<VStack spacing={'4'} w={'full'} alignItems={'start'}>
									<Text fontSize={'md'} color={'hu-Green.normal'}>
										Client
									</Text>
									<HStack spacing={5}>
										<Avatar
											boxShadow={'5px 5px 10px 0px #00000020'}
											borderRadius={'10px'}
											size={'lg'}
											name={dataDetailProject?.project?.client?.name}
											src={dataDetailProject?.project?.client?.avatar?.url}
										/>
										<VStack spacing={'5px'} alignItems={'start'}>
											<Text fontWeight={'semibold'} fontSize={'16px'}>
												{dataDetailProject?.project?.client?.salutation +
													'. ' +
													dataDetailProject?.project?.client?.name}
											</Text>
											<Text fontSize={'14px'} color={'gray'}>
												{dataDetailProject?.project?.client?.company_name}
											</Text>
										</VStack>
									</HStack>
								</VStack>

								<VStack w={'full'} spacing={'4'} alignItems={'start'}>
									<Text fontSize={'md'} color={'hu-Green.normal'}>
										Progress
									</Text>
									<CTooltip
										hasArrow
										label={`${dataDetailProject?.project?.Progress}%`}
										bg="gray.300"
										color="black"
									>
										<VStack
											spacing={4}
											borderRadius={'10px'}
											boxShadow={'5px 5px 10px 0px #00000020'}
											paddingInline={'20px'}
											paddingBlock={'15px'}
											w={'full'}
											bg={
												Number(dataDetailProject?.project?.Progress) < 50
													? 'red.200'
													: Number(dataDetailProject?.project?.Progress) <
													  70
													? 'yellow.200'
													: 'green.200'
											}
										>
											<HStack w={'full'} justifyContent={'space-between'}>
												<Text color={'black'}>
													{dataDetailProject?.project?.start_date &&
														`${new Date(
															dataDetailProject.project.start_date
														).getDate()}-${
															new Date(
																dataDetailProject.project.start_date
															).getMonth() + 1
														}-${new Date(
															dataDetailProject.project.start_date
														).getFullYear()}`}
												</Text>
												<Text color={'black'}>
													{dataDetailProject?.project?.deadline &&
														`${new Date(
															dataDetailProject.project.deadline
														).getDate()}-${
															new Date(
																dataDetailProject.project.deadline
															).getMonth() + 1
														}-${new Date(
															dataDetailProject.project.deadline
														).getFullYear()}`}
												</Text>
											</HStack>

											<Progress
												colorScheme={
													Number(dataDetailProject?.project?.Progress) <
													50
														? 'red'
														: Number(
																dataDetailProject?.project?.Progress
														  ) < 70
														? 'yellow'
														: 'green'
												}
												borderRadius={'full'}
												w={'full'}
												height={'15px'}
												hasStripe
												value={dataDetailProject?.project?.Progress}
											/>
										</VStack>
									</CTooltip>
								</VStack>
							</VStack>
						</VStack>
					</GridItem>
					<GridItem colSpan={[2, null, null, null, null, 1]} overflow={'hidden'}>
						<VStack spacing={'4'} alignItems={'start'} w={'full'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Hours Logged
							</Text>
							<Box
								id={'hoang'}
								w={'full'}
								padding={'20px'}
								bg={colorMode == 'light'? '#fafafa': '#1e2636'}
								borderRadius={'10px'}
								h={'300px'}
								pos={'relative'}
							>
								{dataDetailProject?.project?.hours_estimate != 0 ||
								(dataHoursLogged?.projectHoursLogged != 0 && dataHoursLogged) ? (
									<Bar
										colors={['#00A991', '#FFAAA7']}
										labels={['Planned', 'Actual']}
										data={
											[
												dataDetailProject?.project?.hours_estimate || 0,
												dataHoursLogged?.projectHoursLogged || 0,
											] as number[]
										}
										height={260}
									/>
								) : (
									<Empty height="220px" />
								)}
							</Box>
						</VStack>
					</GridItem>
					<GridItem colSpan={[2, null, null, null, null, 1]} overflow={'hidden'}>
						<VStack spacing={'4'} alignItems={'start'} w={'full'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Project Budget
							</Text>
							<Box
								id={'hoang'}
								w={'full'}
								padding={'20px'}
								bg={colorMode == 'light'? '#fafafa': '#1e2636'}
								borderRadius={'10px'}
								h={'300px'}
								pos={'relative'}
							>
								{dataDetailProject?.project?.project_budget != 0 ||
								dataEarning?.projectEarnings != 0 ? (
									dataEarning && (
										<Bar
											isMoney={true}
											colors={['#00A991', '#FFAAA7']}
											labels={['Planned', 'Actual']}
											data={
												[
													dataDetailProject?.project?.project_budget || 0,
													dataEarning?.projectEarnings || 0,
												] as number[]
											}
											height={260}
										/>
									)
								) : (
									<Empty height={'220px'} />
								)}
							</Box>
						</VStack>
					</GridItem>
				</Grid>
			</VStack>
			<VStack spacing={5} w={['full', null, '300px']}>
				<VStack spacing={'4'} alignItems={'start'} w={'full'}>
					<Text fontWeight={'semibold'} fontSize={'xl'}>
						Detail
					</Text>
					<div
						dangerouslySetInnerHTML={{
							__html: dataDetailProject?.project?.project_summary
								? dataDetailProject.project.project_summary
								: '',
						}}
					/>
				</VStack>
				<VStack spacing={'4'} alignItems={'start'} w={'full'}>
					<Text fontWeight={'semibold'} fontSize={'xl'}>
						Active
					</Text>

					<VStack
						overflow={'auto'}
						maxH={['500px', '500px', 'max-content']}
						height={['auto', 'auto', 'calc( 100vh - 245px )']}
						w={'full'}
						spacing={5}
					>
						{allActs?.projectActivity?.map((item, key) => (
							<HStack
								p={4}
								borderRadius={'10px'}
								spacing={3}
								w={'full'}
								alignItems={'start'}
								key={key}
								bg={colorMode == 'dark' ? '#1e2636' : '#f4f6f8'}
							>
								<Box color={'hu-Green.normal'} pt={'4px'}>
									<FiGitCommit fontSize={'16px'} />
								</Box>

								<VStack alignItems={'start'}>
									<Text fontWeight={'semibold'}>{item.content}</Text>
									<Text fontSize={'14px'} color={'gray.400'}>
										{new Date(item.createdAt).toLocaleDateString('es-CL')},{' '}
										{item.time}
									</Text>
								</VStack>
							</HStack>
						))}
					</VStack>
				</VStack>
			</VStack>
		</Stack>
	)
}

Overview.getLayout = ProjectLayout

export default Overview
