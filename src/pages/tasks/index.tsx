import { Drawer } from 'components/Drawer'
import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
	Drawer as CDrawer,
	useColorMode,
} from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'
import { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import AddTask from './add-tasks'
import DetailTask from './[taskId]'
import UpdateTask from './[taskId]/update-task'
import { useRouter } from 'next/router'
import { AuthContext } from 'contexts/AuthContext'
import {
	allEmployeesNormalQuery,
	allMilestonesQuery,
	allProjectsNormalQuery,
	allTaskCategoriesQuery,
	allTasksByEmployeeQuery,
	allTasksQuery,
} from 'queries'
import { IFilter, TColumn } from 'type/tableTypes'
import { AlertDialog, Table } from 'components/common'
import { arrayFilter, dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { employeeType, IOption, timeLogType } from 'type/basicTypes'
import { RiPencilLine } from 'react-icons/ri'
import { IoEyeOutline } from 'react-icons/io5'
import { deleteTaskMutation, deleteTasksMutation } from 'mutations'
import { DateRange, Input, Select as SelectF, SelectCustom } from 'components/filter'
import { AiOutlineSearch } from 'react-icons/ai'

const tasks: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	const [taskId, setTaskId] = useState<string | number>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// set employees to filter
	const [employees, setEmployees] = useState<IOption[]>([])

	// query
	// get all tasks
	const { data: allTasks, mutate: refetchTasks } =
		currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Client')
			? allTasksQuery(isAuthenticated)
			: allTasksByEmployeeQuery(isAuthenticated, currentUser?.id)

	// get all projects to filter
	const { data: dataAllProjects } = allProjectsNormalQuery(isAuthenticated)

	// get all employees to filter
	const { data: allEmplsNormal } = allEmployeesNormalQuery(isAuthenticated)

	// get all task categories to filter
	const { data: allCategories } = allTaskCategoriesQuery()

	// get all milestones to filter
	const { data: allMilestones } = allMilestonesQuery(isAuthenticated)

	// mutation
	// delete one
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteTaskMutation(setToast)
	// delete many
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] = deleteTasksMutation(setToast)

	//Modal -------------------------------------------------------------
	// set open add task
	const {
		isOpen: isOpenAddTask,
		onOpen: onOpenAddTask,
		onClose: onCloseAddTask,
	} = useDisclosure()

	// set open update task
	const {
		isOpen: isOpenUpdateTask,
		onOpen: onOpenUpdateTask,
		onClose: onCloseUpdateTask,
	} = useDisclosure()

	// set open detail task
	const {
		isOpen: isOpenDetailTask,
		onOpen: onOpenDetailTask,
		onClose: onCloseDetailTask,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete many
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

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

	useEffect(() => {
		if (allTasks) {
			console.log(allTasks)
			setIsloading(false)
		}
	}, [allTasks])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: 'success',
				msg: dataDlOne.message,
			})
			refetchTasks()
			setIsloading(false)
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: 'success',
				msg: dataDlMany.message,
			})
			refetchTasks()
			setDataSl([])
			setIsloading(false)
		}
	}, [statusDlMany])

	// set employee to filter
	useEffect(() => {
		if (allEmplsNormal?.employees) {
			const valuesFilter = allEmplsNormal.employees.map(
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
			setEmployees(valuesFilter)
		}
	}, [allEmplsNormal, colorMode])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Tasks',
			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
					Cell: ({ value }) => {
						return value
					},
				},
				{
					Header: 'Task',
					accessor: 'name',
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
					filter: textFilter(['name']),
				},
				{
					Header: 'Project',
					accessor: 'project',
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
					filter: selectFilter(['project', 'id']),
				},
				{
					Header: 'Deadline',
					accessor: 'deadline',
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text color={'red'} isTruncated>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
					filter: dateFilter(['deadline']),
				},
				{
					Header: 'Hours Logged',
					accessor: 'time_logs',
					Cell: ({ value }) => {
						var result
						if (value.length == 0) {
							result = 0
						} else {
							value.map((item: timeLogType) => {
								result = item.total_hours
							})
						}

						return <Text isTruncated>{result} hrs</Text>
					},
				},
				{
					Header: 'milestone',
					accessor: 'milestone',
					Cell: ({ value }) => {
						return <Text isTruncated>{value?.title}</Text>
					},
					filter: selectFilter(['milestone', 'id']),
				},
				{
					Header: 'Task Category',
					accessor: 'task_category',
					Cell: ({ value }) => {
						return <Text isTruncated>{value?.name}</Text>
					},
					filter: selectFilter(['task_category', 'id']),
				},

				{
					Header: 'Assign to',
					accessor: 'employees',
					filter: arrayFilter(['employees'], 'id'),
					Cell: ({ value }) => {
						return (
							<AvatarGroup size="sm" max={2}>
								{value.length != 0 &&
									value.map((employee: employeeType) => (
										<Avatar
											name={employee.name}
											key={employee.id}
											src={employee.avatar?.url}
										/>
									))}
							</AvatarGroup>
						)
					},
				},
				{
					Header: 'Assign By',
					accessor: 'assignBy',
					filter: selectFilter(['assignBy', 'id']),
					Cell: ({ value }) => {
						return value?.name
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					Cell: ({ value }) => (
						<HStack alignItems={'center'}>
							<Box background={value.color} w={'3'} borderRadius={'full'} h={'3'} />
							<Text>{value.title}</Text>
						</HStack>
					),
					filter: selectFilter(['status', 'id']),
				},
				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => {
						return (
							<Menu>
								<MenuButton as={Button} paddingInline={3}>
									<MdOutlineMoreVert />
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() => {
											setTaskId(Number(row.values['id']))
											onOpenDetailTask()
										}}
										icon={<IoEyeOutline fontSize={'15px'} />}
									>
										View
									</MenuItem>

									{(currentUser?.role === 'Admin' ||
										(currentUser?.role === 'Employee' &&
											row.original?.assignBy?.id === currentUser?.id)) && (
										<>
											<MenuItem
												onClick={() => {
													setTaskId(Number(row.values['id']))
													onOpenUpdateTask()
												}}
												icon={<RiPencilLine fontSize={'15px'} />}
											>
												Edit
											</MenuItem>

											<MenuItem
												onClick={() => {
													setTaskId(Number(row.values['id']))
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
						)
					},
				},
			],
		},
	]

	return (
		<Box>
			{currentUser?.role === 'Admin' && (
				<>
					<Button onClick={onOpenAddTask}>Add new</Button>
					<Button
						disabled={!dataSl || dataSl.length == 0 ? true : false}
						onClick={onOpenDlMany}
					>
						Delete all
					</Button>
				</>
			)}
			<Button onClick={onOpenFilter}>Filter</Button>
			<Button
				onClick={() => {
					setIsReset(true)
					setTimeout(() => {
						setIsReset(false)
					}, 1000)
				}}
			>
				reset filter
			</Button>

			<Table
				data={allTasks?.tasks || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role === "Admin"}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				disableColumns={['milestone', 'assignBy', 'task_category']}
				isResetFilter={isResetFilter}
			/>

			<Drawer size="xl" title="Add New Task" onClose={onCloseAddTask} isOpen={isOpenAddTask}>
				<AddTask onCloseDrawer={onCloseAddTask} />
			</Drawer>

			<Drawer
				size="xl"
				title="Update Task"
				onClose={onCloseUpdateTask}
				isOpen={isOpenUpdateTask}
			>
				<UpdateTask taskIdProp={taskId} onCloseDrawer={onCloseUpdateTask} />
			</Drawer>

			<Drawer
				size="xl"
				title={`Task #${taskId}`}
				onClose={onCloseDetailTask}
				isOpen={isOpenDetailTask}
			>
				<DetailTask taskIdProp={taskId} onCloseDrawer={onCloseDetailTask} />
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteOne(String(taskId))
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
						deleteMany(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>
			<CDrawer isOpen={isOpenFilter} placement="right" onClose={onCloseFilter}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Filters</DrawerHeader>

					<DrawerBody>
						<VStack spacing={5}>
							<Input
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'name'}
								label="Task"
								placeholder="Enter task title"
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
								type={'text'}
							/>
							<DateRange
								handleSelect={(date: { from: Date; to: Date }) => {
									setFilter({
										columnId: 'deadline',
										filterValue: date,
									})
								}}
								label="Select date"
							/>
							<SelectF
								options={dataAllProjects?.projects?.map((project) => ({
									label: project.name,
									value: project.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'project'}
								label="Project"
								placeholder="Select project"
							/>

							<SelectF
								options={allCategories?.taskCategories?.map((category) => ({
									label: category.name,
									value: category.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'task_category'}
								label="Category"
								placeholder="Select category"
							/>
							<SelectF
								options={allMilestones?.milestones?.map((milestone) => ({
									label: milestone.title,
									value: milestone.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'milestone'}
								label="Milestone"
								placeholder="Select milestone"
							/>

							<SelectCustom
								handleSearch={(field: any) => {
									setFilter({
										columnId: 'employees',
										filterValue: field.value,
									})
								}}
								label={'Assign to'}
								name={'employees'}
								options={[
									{
										label: (
											<Text color={colorMode == 'light' ? 'black' : 'white'}>
												all
											</Text>
										),
										value: '',
									},
									...employees,
								]}
								required={false}
							/>
							{(currentUser?.role === 'Admin' || currentUser?.role === 'Client') && (
								<SelectCustom
									handleSearch={(field: any) => {
										setFilter({
											columnId: 'assignBy',
											filterValue: field.value,
										})
									}}
									label={'Assign by'}
									name={'assignBy'}
									options={[
										{
											label: (
												<Text
													color={colorMode == 'light' ? 'black' : 'white'}
												>
													all
												</Text>
											),
											value: '',
										},
										...employees,
									]}
									required={false}
								/>
							)}
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

tasks.getLayout = ClientLayout

export default tasks
