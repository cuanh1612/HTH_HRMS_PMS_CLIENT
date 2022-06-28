import {
	Box,
	Collapse,
	Grid,
	HStack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react'
import { Donut } from 'components/charts'
import { Card, ItemDashboard } from 'components/common'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
	clientCountProjectStatusQuery,
	clientTotalProejctsQuery,
	countContractSignedQuery,
	pendingMilestoneClientQuery,
} from 'queries'
import { useContext, useEffect } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'
import { VscTasklist } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'

export interface ITaskCategoryProps {}

const privateDashboard: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()

	const { onToggle: onToggleCards, isOpen: isOpenCards } = useDisclosure({
		defaultIsOpen: true,
	})

	//Query -------------------------------------------------------------------------------------------------

	const { data: dataTotalProject } = clientTotalProejctsQuery(
		isAuthenticated,
		currentUser?.role === 'Client' ? currentUser?.id : undefined
	)

	const { data: dataCountContractSigned } = countContractSignedQuery(
		isAuthenticated,
		currentUser?.role === 'Client' ? currentUser?.id : undefined
	)

	const { data: dataCountProjectStatus } = clientCountProjectStatusQuery(
		isAuthenticated,
		currentUser?.role === 'Client' ? currentUser?.id : undefined
	)

	const { data: dataPendingMilestone } = pendingMilestoneClientQuery(
		isAuthenticated,
		currentUser?.role === 'Client' ? currentUser?.id : undefined
	)

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
			<Head>
				<title>Huprom - Private dashboard</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
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
						title={'Total projects'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataTotalProject?.totalProjects || 0}
					/>
					<Card
						link={'/'}
						icon={<VscTasklist fontSize={'20px'} />}
						title={'Contracts signed'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataCountContractSigned?.countStatusProjects || 0}
					/>
				</Grid>
			</Collapse>
			<Grid
				w={'full'}
				templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']}
				gap={6}
			>
				<ItemDashboard title="Status project">
					<>
						{dataCountProjectStatus?.countProjectStatus && (
							<Donut
								colors={dataCountProjectStatus.countProjectStatus.map((e) => {
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
								labels={dataCountProjectStatus.countProjectStatus.map((e) => {
									return e.project_status
								})}
								data={
									dataCountProjectStatus.countProjectStatus.map((e) => {
										return Number(e.count)
									}) as number[]
								}
								height={280}
							/>
						)}
					</>
				</ItemDashboard>

				<ItemDashboard title="Pending Milestone" overflow={'auto'}>
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
								{dataPendingMilestone?.pendingMilestone &&
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
			</Grid>
		</Box>
	)
}

privateDashboard.getLayout = ClientLayout
export default privateDashboard
