import {
	Avatar,
	Box,
	Grid,
	GridItem,
	HStack,
	Stack,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import {
	clientCountProjectStatusQuery,
	allProjectsByCurrentUserQuery,
	clientTotalEarningQuery,
	clientTotalProejctsQuery,
	detailClientQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineProject } from 'react-icons/ai'
import { SWRConfig } from 'swr'
import { authMutaionResponse, clientMutaionResponse } from 'type/mutationResponses'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { NextLayout } from 'type/element/layout'
import { ClientLayout } from 'components/layouts'
import { Donut } from 'components/charts'
import { TColumn } from 'type/tableTypes'
import { AlertDialog, Static, Table } from 'components/common'
import { deleteProjectMutation } from 'mutations'
import { Drawer } from 'components/Drawer'
import UpdateProject from 'src/pages/projects/update-projects'
import { clientProjectsColumn } from 'utils/columns'
import Head from 'next/head'
ChartJS.register(ArcElement, Tooltip, Legend)

const DetailClient: NextLayout | any = ({
	dataDetailClientServer,
	clientIdProp,
}: {
	dataDetailClientServer?: clientMutaionResponse
	clientIdProp?: string | number
}) => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { clientId } = router.query

	//State -------------------------------------------------------------------
	const [projectStatic, setProjectStatic] = useState<{
		data: number[]
		colors: string[]
		titles: string[]
	}>()
	// get id to delete project
	const [projectId, setProjectId] = useState<number>()
	// set loading table
	const [isLoading, setIsLoading] = useState(true)

	//Query -------------------------------------------------------------------
	const { data: dataDetailClient } = detailClientQuery(isAuthenticated, clientId as string)
	const { data: dataTotalProjects } = clientTotalProejctsQuery(
		isAuthenticated,
		(clientId as string) || clientIdProp
	)
	const { data: dataTotalEarnings } = clientTotalEarningQuery(isAuthenticated, clientId as string)
	const { data: dataCountProjectStatus } = clientCountProjectStatusQuery(
		isAuthenticated,
		(clientId as string) || clientIdProp
	)
	const { data: allProjects, mutate: refetchAllProjects } =
		allProjectsByCurrentUserQuery(isAuthenticated)

	// mutation ----------------------------
	// delete project
	const [mutateDeletePj, { status: statusDl, data: dataDl }] = deleteProjectMutation(setToast)

	// set isOpen of dialog or drawer
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//Funcion -----------------------------------------------------------------

	//effect --------------------------------------------------------------
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

	useEffect(() => {
		if (allProjects) {
			console.log(allProjects.projects)
			setIsLoading(false)
		}
	}, [allProjects])

	useEffect(() => {
		if (dataCountProjectStatus?.countProjectStatus) {
			const titles = dataCountProjectStatus?.countProjectStatus?.map(
				(projectStatus) => projectStatus.project_status
			)
			const data = dataCountProjectStatus?.countProjectStatus?.map((projectStatus) =>
				Number(projectStatus.count)
			)
			const colors = dataCountProjectStatus?.countProjectStatus?.map((projectStatus) => {
				if (projectStatus.project_status === 'Not Started') return '#FFCE56'
				if (projectStatus.project_status === 'In Progress') return '#36A2EB'
				if (projectStatus.project_status === 'On Hold') return '#9966FF'
				if (projectStatus.project_status === 'Canceled') return '#FF6384'
				if (projectStatus.project_status === 'Finished') return '#FF6384'
				return '#9966FF33'
			})
			setProjectStatic({
				titles,
				data,
				colors,
			})
		}
	}, [dataCountProjectStatus])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDl,
			})
			refetchAllProjects()
		}
	}, [statusDl])

	// header ----------------------------------------
	const columns: TColumn[] = clientProjectsColumn({
		currentUser,
		onDelete: (id: number) => {
			setProjectId(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setProjectId(id)
			onOpenUpdate()
		},
	})

	//Url initial query detail client
	const urlDetailClient = `clients/${clientId}`

	return (
		<>
			<SWRConfig
				value={{
					fallback: { [urlDetailClient]: dataDetailClientServer },
				}}
			>
				<Head>
					<title>Huprom - Detail client {clientId}</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				</Head>
				<Box w="full" pb={8}>
					<VStack spacing={5} alignItems={'start'} w={'full'}>
						<HStack spacing={5} h={'full'} w={'full'}>
							<Avatar
								name={dataDetailClient?.client?.name}
								src={dataDetailClient?.client?.avatar?.url}
								size={'xl'}
							/>
							<VStack spacing={'1px'} align={'start'} height={'full'}>
								<Text fontSize={'20px'} fontWeight={'semibold'}>
									{dataDetailClient?.client?.name}
								</Text>
								<Text color={'gray.400'}>
									{dataDetailClient?.client?.company_name}
								</Text>
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
										<Text color={'gray.400'}>Full Name</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.name}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Email</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.email}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Company Name</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataDetailClient?.client?.company_name || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Mobile</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.mobile || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Office Phone Number</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataDetailClient?.client?.office_phone_number || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Office Website</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataDetailClient?.client?.official_website || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>GST/VAT Number</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataDetailClient?.client?.gst_vat_number || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Adress</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>
											{dataDetailClient?.client?.company_address || '--'}
										</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>State</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.state || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>City</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.city || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Postal Code</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.postal_code || '--'}</Text>
									</GridItem>
									<GridItem colSpan={[3, 1]}>
										<Text color={'gray.400'}>Note</Text>
									</GridItem>
									<GridItem colSpan={[3, 2]}>
										<Text>{dataDetailClient?.client?.note || '--'}</Text>
									</GridItem>
								</Grid>
							</VStack>

							<VStack alignItems={'start'} spacing={10} w={'full'}>
								<VStack alignItems={'start'} spacing={4} w={'full'}>
									<Text fontWeight={'semibold'} fontSize={'20px'}>
										Static
									</Text>
									<Grid
										templateColumns={[
											'repeat(1, 1fr)',
											null,
											null,
											null,
											null,
											'repeat(2, 1fr)',
										]}
										gap={6}
										w={'full'}
									>
										<Static
											title={'Projects'}
											text={dataTotalProjects?.totalProjects}
											icon={<AiOutlineProject fontSize={20} />}
											color={'Green'}
										/>

										<Static
											title={'Earnings'}
											text={Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
												useGrouping: false,
											}).format(Number(dataTotalEarnings?.totalEarnings))}
											icon={<AiOutlineProject fontSize={20} />}
											color={'Pink'}
										/>
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
												{projectStatic && (
													<Donut
														labels={projectStatic.titles}
														colors={projectStatic.colors}
														data={projectStatic.data}
														height={280}
													/>
												)}
											</Box>
										</VStack>
									</GridItem>
								</Grid>
							</VStack>
						</Stack>
						<Box w={'full'}>
							<Text mb={4} fontWeight={'semibold'} fontSize={'xl'}>
								all projects
							</Text>

							<Table
								data={allProjects?.projects || []}
								columns={columns}
								isLoading={isLoading}
								disableColumns={['project_category']}
							/>
						</Box>
					</VStack>
					{/* open drawer to show from to update */}
					<Drawer
						size="xl"
						title="Update Project"
						onClose={onCloseUpdate}
						isOpen={isOpenUpdate}
					>
						<UpdateProject onCloseDrawer={onCloseUpdate} projectIdUpdate={projectId} />
					</Drawer>

					{/* alert dialog when delete one */}
					<AlertDialog
						handleDelete={() => {
							setIsLoading(true)
							mutateDeletePj(String(projectId))
						}}
						title="Are you sure?"
						content="You will not be able to recover the deleted record!"
						isOpen={isOpenDialogDl}
						onClose={onCloseDl}
					/>
				</Box>
			</SWRConfig>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const res: authMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh_token`,
		{
			headers: context.req.headers as HeadersInit,
		}
	).then((result) => result.json())

	//get detail client
	const queryClient: clientMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${context.query.clientId}`,
		{
			headers: {
				Authorization: `bearer ${res.accessToken}`,
				...(context.req.headers as HeadersInit),
			},
		}
	).then((result) => result.json())

	if (!queryClient.client) {
		return {
			notFound: true,
		}
	}

	return {
		props: { dataDetailClientServer: queryClient }, // will be passed to the page component as props
	}
}

DetailClient.getLayout = ClientLayout

export default DetailClient
