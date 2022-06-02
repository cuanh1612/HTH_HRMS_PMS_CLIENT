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
import { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import { ProjectLayout } from 'components/layouts'
import { StatisticPrj } from 'components/common'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const Overview: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//query ----------------------------------------------------------------------
	// get detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)
	const { data: dataEarning } = projectEarningsQuery(isAuthenticated, projectId as string)
	const { data: dataHoursLogged } = projectHoursLoggedQuery(isAuthenticated, projectId as string)
	const { data: dataCountStatus } = countStatusTasksQuery(isAuthenticated, projectId as string)

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

	return (
		<Stack direction={'row'} spacing={'30px'}>
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
					<GridItem w="100%" minW={'100%'} maxW={'100%'}>
						<VStack spacing={'4'} alignItems={'start'} w={'full'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Tasks
							</Text>
							<Box
								w={'full'}
								padding={'20px'}
								border={'2px solid'}
								borderColor={'hu-Green.lightA'}
								borderRadius={'10px'}
								h={'300px'}
								bg={'hu-Green.light'}
								boxShadow={'5px 5px 10px 0px #00000025'}
							>
								<Pie
									options={{
										maintainAspectRatio: false,
										plugins: {
											legend: {
												position: 'right',
											},
										},
									}}
									data={{
										labels: dataCountStatus?.countstatusTasks.map(
											(e) => e.title
										),
										datasets: [
											{
												label: '# of Votes',
												data: dataCountStatus?.countstatusTasks.map(
													(e) => e.count
												),
												backgroundColor:
													dataCountStatus?.countstatusTasks.map(
														(e) => `${e.color}50`
													),
												borderColor: dataCountStatus?.countstatusTasks.map(
													(e) => `${e.color}60`
												),
												borderWidth: 2,
											},
										],
									}}
								/>
							</Box>
						</VStack>
					</GridItem>
					<GridItem w="100%">
						<VStack spacing={'4'} alignItems={'start'} w={'full'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Info project
							</Text>
							<VStack
								w={'full'}
								padding={'20px'}
								border={'2px solid'}
								borderColor={'hu-Green.lightA'}
								borderRadius={'10px'}
								h={'300px'}
								alignItems={'start'}
								spacing={5}
								bg={'hu-Green.light'}
								boxShadow={'5px 5px 10px 0px #00000025'}
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

								<VStack
									w={'full'}
									minW={'300px'}
									spacing={'4'}
									alignItems={'start'}
								>
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
												<Text>
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
												<Text>
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
				</Grid>

				<HStack w={'full'} spacing={5}>
					<VStack spacing={'4'} alignItems={'start'} w={'50%'}>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
							Hours Logged
						</Text>
						<Box
							pos="relative"
							padding={'20px'}
							border={'2px solid'}
							borderColor={'hu-Green.lightA'}
							borderRadius={'10px'}
							h={'250px'}
							w={'full'}
							bg={'hu-Green.light'}
							boxShadow={'5px 5px 10px 0px #00000025'}
						>
							{dataDetailProject && dataHoursLogged && (
								<Bar
									options={{
										responsive: true,
										plugins: {
											legend: {
												position: 'top' as const,
												display: false,
											},
										},
										scales: {
											y: {
												grid: {
													display: false,
												},
											},
											x: {
												grid: {
													display: false,
												},
											},
										},
										maintainAspectRatio: false,
										animation: true as any,
									}}
									data={{
										labels: ['Planned', 'Actual'],
										datasets: [
											{
												label: 'salary',
												data: [
													dataDetailProject?.project?.hours_estimate || 0,
													dataHoursLogged.projectHoursLogged,
												] as any,
												backgroundColor: ['#D5ECC2', '#FFE5E4'],
												borderColor: ['#C0D4AF', '#E69996'],
												borderWidth: 2,
												borderRadius: 10,
											},
										],
									}}
								/>
							)}
						</Box>
					</VStack>
					<VStack spacing={'4'} alignItems={'start'} w={'50%'}>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
							Project Budget
						</Text>
						<Box
							padding={'20px'}
							border={'2px solid'}
							borderColor={'hu-Green.lightA'}
							borderRadius={'10px'}
							h={'250px'}
							pos="relative"
							w={'full'}
							bg={'hu-Green.light'}
							boxShadow={'5px 5px 10px 0px #00000025'}
						>
							{dataDetailProject && dataEarning && (
								<Bar
									options={{
										responsive: true,
										plugins: {
											legend: {
												position: 'top' as const,
												display: false,
											},
										},
										maintainAspectRatio: false,
										animation: true as any,
										scales: {
											y: {
												grid: {
													display: false,
												},
											},
											x: {
												grid: {
													display: false,
												},
											},
										},
									}}
									data={{
										labels: ['Planned', 'Actual'],
										datasets: [
											{
												label: 'salary',
												data: [
													dataDetailProject?.project?.project_budget || 0,
													dataEarning.projectEarnings,
												] as any,
												backgroundColor: ['#D5ECC2', '#FFE5E4'],
												borderColor: ['#C0D4AF', '#E69996'],
												borderWidth: 2,
												borderRadius: 10,
											},
										],
									}}
								/>
							)}
						</Box>
					</VStack>
				</HStack>
			</VStack>
			<VStack spacing={5} w={'300px'}>
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
					
				</VStack>
			</VStack>
		</Stack>
	)
}

Overview.getLayout = ProjectLayout

export default Overview
