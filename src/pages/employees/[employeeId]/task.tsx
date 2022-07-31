import {
	Avatar,
	Box,
	Button,
	HStack,
	Text,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select, SelectCustom } from 'components/filter'
import { EmployeeLayout } from 'components/layouts/Employee'
import { AuthContext } from 'contexts/AuthContext'
import { deleteTaskMutation, deleteTasksMutation } from 'mutations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
	allEmployeesNormalQuery,
	allMilestonesQuery,
	allProjectsNormalQuery,
	allTaskCategoriesQuery,
	allTasksByEmployeeQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { VscFilter } from 'react-icons/vsc'
import DetailTask from 'src/pages/tasks/[taskId]'
import UpdateTask from 'src/pages/tasks/[taskId]/update-task'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { employeeTasksColumn } from 'utils/columns'

const TasksEmployee: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	const { colorMode } = useColorMode()

	const [taskId, setTaskId] = useState<string | number>()

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

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
	const { data: allTasks, mutate: refetchTasks } = allTasksByEmployeeQuery(
		isAuthenticated,
		employeeId as string
	)

	// get all projects to filter
	const { data: dataAllProjects } = allProjectsNormalQuery(isAuthenticated)

	// get all employees to filter
	const { data: allEmplsNormal } = allEmployeesNormalQuery(isAuthenticated)

	// get all task categories to filter
	const { data: allCategories } = allTaskCategoriesQuery()

	// get all milestones to filter
	const { data: allMilestones } = allMilestonesQuery(isAuthenticated)

	// mutation----------------------------------------------------------
	// delete one
	const [deleteOne, { status: statusDlOne, data: dataDl}] = deleteTaskMutation(setToast)
	// delete many
	const [deleteMany, { status: statusDlMany, data: dataDlMany}] = deleteTasksMutation(setToast)

	//Modal -------------------------------------------------------------

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

	useEffect(() => {
		if (allTasks) {
			setIsLoading(false)
		}
	}, [allTasks])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDl) {
			setToast({
				type: statusDlOne,
				msg: dataDl.message,
			})
			refetchTasks()
			setIsLoading(false)

			if (socket) {
				socket.emit('newTask')
			}
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			refetchTasks()
			setDataSl([])
			setIsLoading(false)

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

	useEffect(() => {
		if (isOpenUpdateTask == false) {
			refetchTasks()
		}
	}, [isOpenUpdateTask])

	// header ----------------------------------------
	const columns: TColumn[] = employeeTasksColumn({
		currentUser,
		onDelete: (id: number) => {
			setTaskId(Number(id))
			onOpenDl()
		},
		onDetail: (id: number) => {
			setTaskId(Number(id))
			onOpenDetailTask()
		},
		onUpdate: (id: number) => {
			setTaskId(Number(id))
			onOpenUpdateTask()
		},
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Tasks of employee {employeeId}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

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
					description={'Delete all tasks you selected'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
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
					setIsLoading(true)
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
						setIsLoading(true)
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
					<Select
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

					<Select
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
					<Select
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

TasksEmployee.getLayout = EmployeeLayout

export default TasksEmployee
