import { Drawer } from 'components/Drawer'
import {
	Avatar,
	Box,
	Button,
	HStack,
	Text,
	useDisclosure,
	VStack,
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
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { MdOutlineEvent } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { IoAdd } from 'react-icons/io5'
import { deleteTaskMutation, deleteTasksMutation } from 'mutations'
import { DateRange, Input, Select as SelectF, SelectCustom } from 'components/filter'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { CSVLink } from 'react-csv'
import { VscFilter } from 'react-icons/vsc'
import { BiExport } from 'react-icons/bi'
import { TasksColumn } from 'utils/columns'
import Head from 'next/head'

const tasks: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	const [taskId, setTaskId] = useState<string | number>()

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

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

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'name', key: 'name' },
		{ label: 'assignBy', key: 'assignBy' },
		{ label: 'start_date', key: 'start_date' },
		{ label: 'deadline', key: 'deadline' },
		{ label: 'description', key: 'description' },
		{ label: 'milestone', key: 'milestone' },
		{ label: 'priority', key: 'priority' },
		{ label: 'project', key: 'project' },
		{ label: 'status', key: 'status' },
		{ label: 'task_category', key: 'task_category' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	// mutation----------------------------------------------------------
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

			if (allTasks.tasks) {
				//Set data csv
				const dataCSV: any[] = allTasks.tasks.map((task) => ({
					id: task.id,
					name: task.name,
					assignBy: task.assignBy?.id,
					start_date: task.start_date,
					deadline: task.deadline,
					description: task.description,
					milestone: task.milestone?.id,
					priority: task.priority,
					project: task.project.id,
					status: task.status.id,
					task_category: task.task_category?.id,
					createdAt: task.createdAt,
					updatedAt: task.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
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

			if (socket) {
				socket.emit('newTask')
			}
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

			if (socket) {
				socket.emit('newTask')
			}
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

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket) {
			socket.emit('joinRoomTask')

			socket.on('getNewTask', () => {
				refetchTasks()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket) {
				socket.emit('leaveRoomTask')
			}
		}

		return leaveRoom
	}, [socket])

	// header ----------------------------------------
	const columns: TColumn[] = TasksColumn({
		currentUser,
		onDetail: (id: number) => {
			setTaskId(Number(id))
			onOpenDetailTask()
		},
		onDelete: (id: number) => {
			setTaskId(Number(id))
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setTaskId(id)
			onOpenUpdateTask()
		},
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Tasks</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new task by form'}
							title={'Add new'}
							action={onOpenAddTask}
						/>
						<CSVLink filename={'tasks.csv'} headers={headersCSV} data={dataCSV}>
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
							description={'Delete all tasks you selected'}
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
				<Func
					icon={<MdOutlineEvent />}
					title={'Calendar'}
					description={'show tasks as calendar'}
					action={() => {
						router.push('/tasks/calendar')
					}}
				/>
			</FuncCollapse>

			<Table
				data={allTasks?.tasks || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role === 'Admin'}
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
			<Drawer
				isOpen={isOpenFilter}
				size={'xs'}
				title={'Filter'}
				onClose={onCloseFilter}
				footer={
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
				}
			>
				<VStack spacing={5} p={6}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'name'}
						label="Task"
						placeholder="Enter task title"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
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
					)}
				</VStack>
			</Drawer>
		</Box>
	)
}

tasks.getLayout = ClientLayout

export default tasks
