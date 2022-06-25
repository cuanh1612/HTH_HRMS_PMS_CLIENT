import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Progress,
	Text,
	Tooltip,
	useDisclosure,
	VStack,
	useColorMode,
	Collapse,
	SimpleGrid,
} from '@chakra-ui/react'
import { AlertDialog, Func, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, Select, SelectCustom } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteProjectMutation, deleteProjectsMutation } from 'mutations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	allClientsQuery,
	allEmployeesNormalQuery,
	allProjectCategoriesQuery,
	allProjectsByCurrentUserQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import {
	AiOutlineCaretDown,
	AiOutlineCaretUp,
	AiOutlineDelete,
	AiOutlineSearch,
} from 'react-icons/ai'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { clientType, employeeType, IOption, projectCategoryType } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { arrayFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddProject from './add-projects'
import UpdateProject from './update-projects'
import { CSVLink } from 'react-csv'
import { BiExport } from 'react-icons/bi'
import { VscFilter } from 'react-icons/vsc'

const Projects: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//State ---------------------------------------------------------------------
	const [projectIdUpdate, setProjectId] = useState<number | undefined>(12)

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// get id to delete project
	const [idDeletePj, setIdDeletePj] = useState<number>()

	// get client to select to filter
	const [clientsFilter, setClientsFilter] = useState<IOption[]>([])

	// get employee to select to filter
	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'name', key: 'name' },
		{ label: 'Progress', key: 'Progress' },
		{ label: 'client', key: 'client' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'currency', key: 'currency' },
		{ label: 'deadline', key: 'deadline' },
		{ label: 'hours_estimate', key: 'hours_estimate' },
		{ label: 'notes', key: 'notes' },
		{ label: 'project_budget', key: 'project_budget' },
		{ label: 'project_summary', key: 'project_summary' },
		{ label: 'send_task_noti', key: 'send_task_noti' },
		{ label: 'start_date', key: 'start_date' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	//set isopen of function
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: true,
	})

	// query and mutation
	const { data: allProjects, mutate: refetchAllProjects } =
		allProjectsByCurrentUserQuery(isAuthenticated)

	const { data: allPjCategories } = allProjectCategoriesQuery(isAuthenticated)

	const { data: allClients } = allClientsQuery(isAuthenticated)

	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// delete project
	const [mutateDeletePj, { status: statusDl }] = deleteProjectMutation(setToast)

	// delete all projects
	const [mutateDeletePjs, { status: statusDlMany }] = deleteProjectsMutation(setToast)

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Holidays',

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
							<Tooltip hasArrow label={`${value}%`} shouldWrapChildren mt="3">
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
							</Tooltip>
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
									onClick={() => {}}
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
												setIdDeletePj(row.values['id'])
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

	// set loading == false when get all holidays successfully
	useEffect(() => {
		if (allProjects) {
			setIsloading(false)

			if (allProjects.projects) {
				//Set data csv
				const dataCSV: any[] = allProjects.projects.map((contract) => ({
					id: contract.id,
					name: contract.name,
					Progress: contract.Progress,
					client: contract.client?.id,
					currency: contract.currency,
					start_date: contract.start_date,
					deadline: contract.deadline,
					hours_estimate: contract.hours_estimate,
					notes: contract.notes,
					project_budget: contract.project_budget,
					project_summary: contract.project_summary,
					send_task_noti: contract.send_task_noti ? 'true' : 'false',
					createdAt: contract.createdAt,
					updatedAt: contract.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [allProjects])

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

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success') {
			setToast({
				msg: 'Delete projects successfully',
				type: 'success',
			})
			setDataSl(null)
			refetchAllProjects()
		}
	}, [statusDlMany])

	// set client to filter
	useEffect(() => {
		if (allClients?.clients) {
			const valuesFilter = allClients.clients.map(
				(client): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar size={'xs'} name={client.name} src={client.avatar?.url} />
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{client.name}
								</Text>
							</HStack>
						</>
					),
					value: String(client.id),
				})
			)
			setClientsFilter(valuesFilter)
		}
	}, [allClients, colorMode])

	// set employee to filter
	useEffect(() => {
		if (allEmployees?.employees) {
			const valuesFilter = allEmployees.employees.map(
				(employee): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{employee.name}
								</Text>
							</HStack>
						</>
					),
					value: String(employee.id),
				})
			)
			setEmployeesFilter(valuesFilter)
		}
	}, [allEmployees, colorMode])

	return (
		<>
			<HStack
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggle}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
			>
				<Text fontWeight={'semibold'}>Function</Text>
				{isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse in={isOpen} animateOpacity>
				<SimpleGrid
					w={'full'}
					cursor={'pointer'}
					columns={[1, 2, 2, 3, null, 4]}
					spacing={10}
					pt={3}
				>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<Func
								icon={<IoAdd />}
								description={'Add new client by form'}
								title={'Add new'}
								action={onOpenAdd}
							/>

							<CSVLink filename={'projects.csv'} headers={headersCSV} data={dataCSV}>
								<Func
									icon={<BiExport />}
									description={'export to csv'}
									title={'export'}
									action={() => {}}
								/>
							</CSVLink>
							<Func
								icon={<AiOutlineDelete />}
								title={'Delete all'}
								description={'Delete all client you selected'}
								action={onOpenDlMany}
								disabled={!dataSl || dataSl.length == 0 ? true : false}
							/>
						</>
					)}
					<Func
						icon={<VscFilter />}
						description={'Open draw to filter'}
						title={'filter'}
						action={onOpenFilter}
					/>
				</SimpleGrid>
			</Collapse>
			<br />

			<Table
				data={allProjects?.projects || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser && currentUser.role === 'Admin' ? true : false}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
				disableColumns={['project_category']}
			/>
			<Drawer size="xl" title="Add Project" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddProject onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Project" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateProject onCloseDrawer={onCloseUpdate} projectIdUpdate={projectIdUpdate} />
			</Drawer>
			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					mutateDeletePj(String(idDeletePj))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsloading(true)
						mutateDeletePjs(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			<Drawer
				isOpen={isOpenFilter}
				onClose={onCloseFilter}
				size={'xs'}
				title="Filter"
				footer={
					<Button
						onClick={() => {
							setIsReset(true)
							setTimeout(() => {
								setIsReset(false)
							}, 1000)
						}}
					>
						reset
					</Button>
				}
			>
				<VStack p={6} spacing={5}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'name'}
						label="Project name"
						placeholder="Enter project name"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>
					<Select
						options={[
							{
								label: 'Not Started',
								value: 'Not Started',
							},
							{
								label: 'In Progress',
								value: 'In Progress',
							},
							{
								label: 'On Hold',
								value: 'On Hold',
							},
							{
								label: 'Canceled',
								value: 'Canceled',
							},
							{
								label: 'Finished',
								value: 'Finished',
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'project_status'}
						label="Status"
						placeholder="Select status"
					/>
					{allPjCategories && (
						<Select
							options={allPjCategories.projectCategories?.map((category) => {
								return {
									label: category.name,
									value: category.id,
								}
							})}
							handleSearch={(data: IFilter) => {
								setFilter(data)
							}}
							columnId={'project_category'}
							label="Project category"
							placeholder="Select category"
						/>
					)}

					{clientsFilter && (
						<SelectCustom
							handleSearch={(field: any) => {
								setFilter({
									columnId: 'client',
									filterValue: field.value,
								})
							}}
							label={'Client'}
							name={'client'}
							options={[
								{
									label: (
										<Text color={colorMode == 'light' ? 'black' : 'white'}>
											all
										</Text>
									),
									value: '',
								},

								...clientsFilter,
							]}
							required={false}
						/>
					)}

					{employeesFilter && (
						<SelectCustom
							handleSearch={(field: any) => {
								setFilter({
									columnId: 'employees',
									filterValue: field.value,
								})
							}}
							label={'Project member'}
							name={'employee'}
							options={[
								{
									label: (
										<Text color={colorMode == 'light' ? 'black' : 'white'}>
											all
										</Text>
									),
									value: '',
								},

								...employeesFilter,
							]}
							required={false}
						/>
					)}
				</VStack>
			</Drawer>
		</>
	)
}

Projects.getLayout = ClientLayout

export default Projects
