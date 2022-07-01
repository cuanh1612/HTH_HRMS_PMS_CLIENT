import {
	Avatar,
	Button,
	HStack,
	Text,
	useDisclosure,
	VStack,
	useColorMode,
	Box,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, Select, SelectCustom } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteProjectMutation, deleteProjectsMutation } from 'mutations'
import { useRouter } from 'next/router'
import {
	allClientsQuery,
	allEmployeesNormalQuery,
	allProjectCategoriesQuery,
	allProjectsByCurrentUserQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import AddProject from './add-projects'
import UpdateProject from './update-projects'
import { CSVLink } from 'react-csv'
import { BiExport } from 'react-icons/bi'
import { VscFilter } from 'react-icons/vsc'
import { projectColumn } from 'utils/columns'
import Head from 'next/head'

const Projects: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//State ---------------------------------------------------------------------
	const [projectId, setProjectId] = useState<number | undefined>(12)

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
	const columns: TColumn[] = projectColumn({
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
		<Box pb={8}>
			<Head>
				<title>Huprom - Projects</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new project by form'}
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
							description={'Delete all projects you selected'}
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
			</FuncCollapse>

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
		</Box>
	)
}

Projects.getLayout = ClientLayout

export default Projects
