import {
	Avatar,
	Box,
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
import { detailProjectQuery, projectEarningsQuery, projectHoursLoggedQuery } from 'queries'
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
	ArcElement
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
				{/* <HStack alignItems={'start'} w={'full'} spacing={10}>
					<VStack spacing={'4'} alignItems={'start'}>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
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
					<VStack minW={'300px'} spacing={'4'} alignItems={'start'}>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
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
								paddingBlock={'10px'}
								w={'full'}
								bg={
									Number(dataDetailProject?.project?.Progress) < 50
										? 'red.200'
										: Number(dataDetailProject?.project?.Progress) < 70
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
										Number(dataDetailProject?.project?.Progress) < 50
											? 'red'
											: Number(dataDetailProject?.project?.Progress) < 70
											? 'yellow'
											: 'green'
									}
									borderRadius={'full'}
									w={'full'}
									height={'5px'}
									hasStripe
									value={dataDetailProject?.project?.Progress}
								/>
							</VStack>
						</CTooltip>
					</VStack>
				</HStack> */}
				<VStack spacing={'4'} w={'full'} alignItems={'start'}>
					<Text fontWeight={'semibold'} fontSize={'xl'}>
						Statistics
					</Text>
					<SimpleGrid w={'full'} minChildWidth="250px" spacing="30px">
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

				<HStack>
					<Box>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
							Hours Logged
						</Text>
						<Pie data={{
							labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
							datasets: [
							  {
								label: '# of Votes',
								data: [12, 19, 3, 5, 2, 3],
								backgroundColor: [
								  'rgba(255, 99, 132, 0.2)',
								  'rgba(54, 162, 235, 0.2)',
								  'rgba(255, 206, 86, 0.2)',
								  'rgba(75, 192, 192, 0.2)',
								  'rgba(153, 102, 255, 0.2)',
								  'rgba(255, 159, 64, 0.2)',
								],
								borderColor: [
								  'rgba(255, 99, 132, 1)',
								  'rgba(54, 162, 235, 1)',
								  'rgba(255, 206, 86, 1)',
								  'rgba(75, 192, 192, 1)',
								  'rgba(153, 102, 255, 1)',
								  'rgba(255, 159, 64, 1)',
								],
								borderWidth: 1,
							  },
							],
						}} />
					</Box>
				</HStack>

				<HStack w={'full'} spacing={5}>
					{dataDetailProject && dataHoursLogged && (
						<VStack spacing={'4'} alignItems={'start'} w={'50%'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Hours Logged
							</Text>
							<Box pos="relative" h={'250px'} w={'full'}>
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
							</Box>
						</VStack>
					)}
					{dataDetailProject && dataEarning && (
						<VStack spacing={'4'} alignItems={'start'} w={'50%'}>
							<Text fontWeight={'semibold'} fontSize={'xl'}>
								Project Budget
							</Text>
							<Box h={'250px'} pos="relative" w={'full'}>
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
							</Box>
						</VStack>
					)}
				</HStack>
			</VStack>
			<Box border="1px solid red" w={'300px'}>
				1
			</Box>
		</Stack>
	)
}

Overview.getLayout = ProjectLayout

export default Overview
