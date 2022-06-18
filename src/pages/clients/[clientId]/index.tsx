import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Tooltip as CTooltip,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Progress,
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
import { IFilter, TColumn } from 'type/tableTypes'
import Link from 'next/link'
import { arrayFilter, selectFilter, textFilter } from 'utils/tableFilters'
import { clientType, employeeType, projectCategoryType } from 'type/basicTypes'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import { RiPencilLine } from 'react-icons/ri'
import { AlertDialog, Table } from 'components/common'
import { deleteProjectMutation } from 'mutations'
import { Drawer } from 'components/Drawer'
import UpdateProject from 'src/pages/projects/update-projects'
ChartJS.register(ArcElement, Tooltip, Legend)

const DetailClient: NextLayout | any = ({
	dataDetailClientServer,
}: {
	dataDetailClientServer?: clientMutaionResponse
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
	const [isLoading, setIsloading] = useState(true)

	//Query -------------------------------------------------------------------
	const { data: dataDetailClient } = detailClientQuery(isAuthenticated, clientId as string)
	const { data: dataTotalProjects } = clientTotalProejctsQuery(
		isAuthenticated,
		clientId as string
	)
	const { data: dataTotalEarnings } = clientTotalEarningQuery(isAuthenticated, clientId as string)
	const { data: dataCountProjectStatus } = clientCountProjectStatusQuery(
		isAuthenticated,
		clientId as string
	)
	const { data: allProjects, mutate: refetchAllProjects } =
		allProjectsByCurrentUserQuery(isAuthenticated)

	// mutation ----------------------------
	// delete project
	const [mutateDeletePj, { status: statusDl }] = deleteProjectMutation(setToast)

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
			setIsloading(false)
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
		if (statusDl == 'success') {
			setToast({
				msg: 'Delete project successfully',
				type: 'success',
			})
			refetchAllProjects()
		}
	}, [statusDl])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Projects',
			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
				},
				{
					Header: 'Project name',
					accessor: 'name',
					minWidth: 200,
					width: 200,
					Cell: ({ value, row }) => (
						<Link href={`/projects/${row.values['id']}/overview`} passHref>
							<Text
								_hover={{
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
								isTruncated={true}
							>
								{value}
							</Text>
						</Link>
					),
					filter: textFilter(['name']),
				},
				{
					Header: 'project_category',
					accessor: 'project_category',
					minWidth: 200,
					width: 200,
					Cell: ({ value }: { value: projectCategoryType }) => (
						<Text isTruncated={true}>{value.name}</Text>
					),
					filter: selectFilter(['project_category', 'id']),
				},
				{
					Header: 'Members',
					accessor: 'employees',
					minWidth: 150,
					width: 150,
					filter: arrayFilter(['employees'], 'id'),
					Cell: ({ value }: { value: employeeType[] }) => {
						return (
							<AvatarGroup size="sm" max={4}>
								{value.map((employee) => (
									<Avatar
										key={employee.id}
										name={employee.name}
										src={employee.avatar?.url}
									/>
								))}
							</AvatarGroup>
						)
					},
				},
				{
					Header: 'Deadline',
					accessor: 'deadline',
					minWidth: 150,
					width: 150,
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'Client',
					accessor: 'client',
					minWidth: 250,
					filter: selectFilter(['client', 'id']),
					Cell: ({ value }: { value: clientType }) => (
						<>
							{value ? (
								<HStack w={'full'} spacing={5}>
									<Avatar
										flex={'none'}
										size={'sm'}
										name={value.name}
										src={value.avatar?.url}
									/>
									<VStack w={'70%'} alignItems={'start'}>
										<Text isTruncated w={'full'}>
											{value.salutation
												? `${value.salutation}. ${value.name}`
												: value.name}
										</Text>
										{value.company_name && (
											<Text
												isTruncated
												w={'full'}
												fontSize={'sm'}
												color={'gray.400'}
											>
												{value.company_name}
											</Text>
										)}
									</VStack>
								</HStack>
							) : (
								''
							)}
						</>
					),
				},
				{
					Header: 'Progress',
					accessor: 'Progress',
					minWidth: 150,
					width: 150,
					Cell: ({ value }: { value: employeeType[] }) => {
						return (
							<CTooltip hasArrow label={`${value}%`} shouldWrapChildren mt="3">
								<Progress
									hasStripe
									borderRadius={5}
									colorScheme={
										Number(value) < 50
											? 'red'
											: Number(value) < 70
											? 'yellow'
											: 'green'
									}
									size="lg"
									value={Number(value)}
								/>
							</CTooltip>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'project_status',
					minWidth: 150,
					width: 150,
					Cell: ({ value }: { value: string }) => {
						var color = ''
						switch (value) {
							case 'Not Started':
								color = 'gray.500'
								break
							case 'In Progress':
								color = 'blue.500'
								break
							case 'On Hold':
								color = 'yellow.500'
								break
							case 'Canceled':
								color = 'red.500'
								break
							case 'Finished':
								color = 'green.500'
								break
						}
						return (
							<HStack alignItems={'center'}>
								<Box background={color} w={'3'} borderRadius={'full'} h={'3'} />
								<Text>{value}</Text>
							</HStack>
						)
					},
				},

				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => (
						<Menu>
							<MenuButton as={Button} paddingInline={3}>
								<MdOutlineMoreVert />
							</MenuButton>
							<MenuList>
								<MenuItem
									onClick={() => {
										router.push(`/projects/${row.values['id']}/overview`)
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>

								{currentUser && currentUser.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												setProjectId(row.values['id'])
												onOpenUpdate()
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>
										<MenuItem
											onClick={() => {
												setProjectId(row.values['id'])
												onOpenDl()
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	//Url initial query detail client
	const urlDetailClient = `clients/${clientId}`

	return (
		<>
			<SWRConfig
				value={{
					fallback: { [urlDetailClient]: dataDetailClientServer },
				}}
			>
				<Box w="full">
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
													<Text>Projects</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{dataTotalProjects?.totalProjects || '0'}
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
													<Text>Earnings</Text>
												</HStack>
												<Text fontWeight={'semibold'} fontSize={'30px'}>
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
														useGrouping: false,
													}).format(
														Number(dataTotalEarnings?.totalEarnings)
													) || '0'}
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
							setIsloading(true)
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
	const res: authMutaionResponse = await fetch('http://localhost:4000/api/auth/refresh_token', {
		headers: context.req.headers as HeadersInit,
	}).then((result) => result.json())

	//get detail client
	const queryClient: clientMutaionResponse = await fetch(
		`http://localhost:4000/api/clients/${context.query.clientId}`,
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
