import { Box, Collapse, Grid, GridItem, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { Card } from 'components/common'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import {
	clientWiseEarningsQuery,
	clientWiseTimeLogsQuery,
	contractsGeneratedQuery,
	contractsSignedQuery,
	hoursLoggedQuery,
	lastestClientsQuery,
	pendingLeavesRawQuery,
	pendingMilestoneQuery,
	pendingTasksQuery,
	pendingTasksRawQuery,
	statusWiseProjects,
	todayAttendanceQuery,
	totalClientsQuery,
	totalEmployeesQuery,
	totalProjectsQuery,
} from 'queries/dashboard'
import { useContext, useEffect } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineCheck, AiOutlineProject } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import { BsPerson } from 'react-icons/bs'
import { VscTasklist } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'

const dashboard: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//
	const {onToggle: onToggleCards, isOpen: isOpenCards} = useDisclosure({
		defaultIsOpen: true
	})

	//Query -------------------------------------------------------------
	const { data: dataPendingTasks } = pendingTasksQuery(isAuthenticated)
	const { data: dataTotalClients } = totalClientsQuery(isAuthenticated)
	const { data: dataTotalEmployees } = totalEmployeesQuery(isAuthenticated)
	const { data: dataTotalProjects } = totalProjectsQuery(isAuthenticated)
	const { data: dataTodayAttendance } = todayAttendanceQuery(isAuthenticated)
	const { data: dataPendingTasksRaw } = pendingTasksRawQuery(isAuthenticated)
	const { data: dataPendingLeavesRaw } = pendingLeavesRawQuery(isAuthenticated)
	const { data: dataHoursLooged } = hoursLoggedQuery(isAuthenticated)
	const { data: dataStatusWiseProjects } = statusWiseProjects(isAuthenticated)
	const { data: dataContractsGenerated } = contractsGeneratedQuery(isAuthenticated)
	const { data: dataPendingMilestone } = pendingMilestoneQuery(isAuthenticated)
	const { data: dataContractsSigned } = contractsSignedQuery(isAuthenticated)
	const { data: dataClientWiseEarnings } = clientWiseEarningsQuery(isAuthenticated)
	const { data: dataClientWiseTimeLogs } = clientWiseTimeLogsQuery(isAuthenticated)
	const { data: dataLastestClients } = lastestClientsQuery(isAuthenticated)

	console.log(dataTotalClients)

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
					templateColumns={[
						'repeat(1, 1fr)',
						'repeat(2, 1fr)',
						'repeat(3, 1fr)',
						null,
						'repeat(4, 1fr)',
					]}
					gap={6}
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
		</Box>
	)
}

dashboard.getLayout = ClientLayout
export default dashboard
