import {
	Avatar,
	AvatarGroup,
	Box,
	Button, Drawer as CDrawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, HStack, Menu, MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure, VStack
} from '@chakra-ui/react'
import { AlertDialog, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select as SelectF } from 'components/filter'
import { ProjectLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteTaskMutation, deleteTasksMutation } from 'mutations'
import { useRouter } from 'next/router'
import {
	allStatusQuery,
	allTasksByEmployeeAndProjectQuery, allTasksByProjectQuery,
	milestonesByProjectNormalQuery
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { employeeType, timeLogType } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddTask from './add-tasks'
import DetailTask from './[taskId]'
import UpdateTask from './[taskId]/update-task'

const tasks: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast, socket } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	const [taskId, setTaskId] = useState<number>()
	const [statusIdShow] = useState<number>(1)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// is reset table
	const [isResetFilter] = useState(false)

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

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

	// query

	// get all task by project
	const { data: allTasks, mutate: refetchTasks } =
		currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Client')
			? allTasksByProjectQuery(isAuthenticated, projectId)
			: allTasksByEmployeeAndProjectQuery(
					isAuthenticated,
					currentUser?.id,
					projectId as string
			  )

	// get all status to filter
	const { data: allStatuses } = allStatusQuery(isAuthenticated, projectId)

	// get all milestones to filter
	const { data: allMilestones } = milestonesByProjectNormalQuery(isAuthenticated, projectId)

	// mutation

	// delete one
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteTaskMutation(setToast)
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] = deleteTasksMutation(setToast)

	//Useeffect ---------------------------------------------------------
	//Handle check login successfully
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// when get all tasks success
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
			if (socket && projectId) {
				socket.emit('newProjectTask', projectId)
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
			if (socket && projectId) {
				socket.emit('newProjectTask', projectId)
			}
		}
	}, [statusDlMany])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && projectId) {
			socket.emit('joinRoomProjectTask', projectId)

			socket.on('getNewProjectTask', () => {
				refetchTasks()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && projectId) {
				socket.emit('leaveRoomProjectTask', projectId)
			}
		}

		return leaveRoom
	}, [socket, projectId])

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
					Header: 'Assign to',
					accessor: 'employees',
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
					Cell: ({ row }) => (
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
					),
				},
			],
		},
	]

	return (
		<Box>
			<Button onClick={onOpenAddTask}>Add task Incomplete</Button>
			<Button disabled={!dataSl || dataSl.length == 0 ? true : false} onClick={onOpenDlMany}>
				Delete all
			</Button>
			<Button onClick={onOpenFilter}>filter</Button>
			<Table
				data={allTasks?.tasks || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				disableColumns={['milestone']}
				isResetFilter={isResetFilter}
			/>

			<Drawer size="xl" title="Add New Task" onClose={onCloseAddTask} isOpen={isOpenAddTask}>
				<AddTask statusId={statusIdShow} onCloseDrawer={onCloseAddTask} />
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
								options={allStatuses?.statuses?.map((item) => ({
									label: item.title,
									value: item.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'status'}
								label="Status"
								placeholder="Select status"
							/>
							<SelectF
								options={allMilestones?.milestones?.map((item) => ({
									label: item.title,
									value: item.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'milestone'}
								label="Milestone"
								placeholder="Select milestone"
							/>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

tasks.getLayout = ProjectLayout

export default tasks
