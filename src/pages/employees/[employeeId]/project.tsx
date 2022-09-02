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
import { AlertDialog, Func, FuncCollapse, Head, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, Select, SelectCustom } from 'components/filter'
import { AuthContext } from 'contexts/AuthContext'
import { deleteProjectMutation, deleteProjectsMutation } from 'mutations'
import { useRouter } from 'next/router'
import {
	allClientsQuery,
	allEmployeesNormalQuery,
	allProjectCategoriesQuery,
	allProjectsByCurrentUserQuery,
	detailEmployeeQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { VscFilter } from 'react-icons/vsc'
import UpdateProject from 'src/pages/projects/update-projects'
import { EmployeeLayout } from 'components/layouts/Employee'
import { employeeProjectColumn } from 'utils/columns'
import { dataProjectStatus } from 'utils/basicData'

const Projects: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	const { colorMode } = useColorMode()

	//State ---------------------------------------------------------------------
	const [projectIdUpdate, setProjectId] = useState<number | undefined>(12)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

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

	//Setup drawer --------------------------------------------------------------
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

	const { data: dataEmployee } = detailEmployeeQuery(isAuthenticated, employeeId as string)

	const { data: allPjCategories } = allProjectCategoriesQuery(isAuthenticated)

	const { data: allClients } = allClientsQuery(isAuthenticated)

	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// delete project
	const [mutateDeletePj, { status: statusDl, data: dataDl }] = deleteProjectMutation(setToast)

	// delete all projects
	const [mutateDeletePjs, { status: statusDlMany, data: dataDlMany }] =
		deleteProjectsMutation(setToast)

	// header ----------------------------------------
	const columns: TColumn[] = employeeProjectColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdDeletePj(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setProjectId(id)
			onOpenUpdate()
		},
	})

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

	// set loading == false when get all holidays successfully
	useEffect(() => {
		if (allProjects) {
			setIsLoading(false)
		}
	}, [allProjects])

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

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: statusDlMany,
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

	useEffect(() => {
		if (isOpenUpdate == false) {
			refetchAllProjects()
		}
	}, [isOpenUpdate])

	return (
		<Box pb={8}>
			<Head title={dataEmployee?.employee?.name} />
			<FuncCollapse>
				<Func
					icon={<VscFilter />}
					description={'Open draw to filter'}
					title={'filter'}
					action={onOpenFilter}
				/>
				<Func
					icon={<AiOutlineDelete />}
					title={'Delete all'}
					description={'Delete all projects you selected'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
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
			<Drawer size="xl" title="Update Project" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateProject onCloseDrawer={onCloseUpdate} projectIdUpdate={projectIdUpdate} />
			</Drawer>
			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
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
						setIsLoading(true)
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
						options={dataProjectStatus}
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
							placeholder='Select client'
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
							placeholder='Select employee'
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

Projects.getLayout = EmployeeLayout

export default Projects
