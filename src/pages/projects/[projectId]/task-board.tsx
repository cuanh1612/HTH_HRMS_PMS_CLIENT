import {
	Avatar,
	AvatarGroup,
	Box,
	HStack,
	StackDivider,
	Text,
	Tooltip,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Column } from 'components/board'
import { AlertDialog } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input } from 'components/form'
import { ProjectLayout } from 'components/layouts'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import {
	changePositionMutation,
	changePositionTaskMutation,
	createStatusColumnMutation,
	deleteStatusColumnMutation,
	deleteTaskMutation,
	updateStatusColumnMutation,
} from 'mutations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allStatusTasksQuery, detailProjectQuery } from 'queries'
import { allActivitiesByProjectQuery } from 'queries/ProjectActivity'
import { useContext, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useForm } from 'react-hook-form'
import { AiOutlineBgColors } from 'react-icons/ai'
import { IoIosAdd } from 'react-icons/io'
import { MdOutlineSubtitles } from 'react-icons/md'
import { statusType } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { statusForm } from 'type/form/basicFormType'
import { CreateStatusColumnValidate } from 'utils/validate'
import AddTask from './tasks-table/add-tasks'
import DetailTask from './tasks-table/[taskId]'
import UpdateTask from './tasks-table/[taskId]/update-task'

const taskBoard: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const [columns, setColumns] = useState<statusType[]>([])
	const [isUpdate, setIsUpdate] = useState(false)
	const [taskId, setTaskId] = useState<string | number>(1)
	const [statusId, setStatusId] = useState<number>(1)

	const { colorMode } = useColorMode()
	const { query } = useRouter()
	const { projectId } = query

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

	// get all status tasks
	const { data: allStatusTasks, mutate: refetchStatusTasks } = allStatusTasksQuery(
		isAuthenticated,
		query.projectId
	)

	// refetch all activities for project
	const { mutate: refetchActivitiesProject } = allActivitiesByProjectQuery(
		isAuthenticated,
		projectId
	)

	// get detail project
	const { data: projectDetail } = detailProjectQuery(isAuthenticated, query.projectId as string)

	// change position status column
	const [changePosition, { status: statusChangePosition }] = changePositionMutation(setToast)

	// change position task column
	const [changeTaskPosition, { status: statusChangeTaskPosition }] =
		changePositionTaskMutation(setToast)

	// create status column
	const [createColumn, { data: dataCreateColumn, status: createColumnStatus }] =
		createStatusColumnMutation(setToast)

	// update status column
	const [updateColumn, { data: dataUpdateColumn, status: statusUpdateColumn }] =
		updateStatusColumnMutation(setToast)

	// delete status column
	const [deleteColumn, { status: deleteColumnStatus, data: dataDeleteColumn }] =
		deleteStatusColumnMutation(setToast)

	// delete task
	const [deleteTask, { status: deleteTaskStatus, data: dataDeleteTask }] =
		deleteTaskMutation(setToast)

	// open modal
	const { isOpen, onClose, onOpen } = useDisclosure()

	// set isOpen of dialog to delete column
	const {
		isOpen: isOpenDialogDlColumn,
		onOpen: onOpenDlColumn,
		onClose: onCloseDlColumn,
	} = useDisclosure()

	// set isOpen of dialog to delete task
	const {
		isOpen: isOpenDialogDlTask,
		onOpen: onOpenDlTask,
		onClose: onCloseDlTask,
	} = useDisclosure()

	// setForm and submit form create new employee ----------------------------------------------------------
	const formSetting = useForm<statusForm>({
		defaultValues: {
			title: '',
			color: '',
		},
		resolver: yupResolver(CreateStatusColumnValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete user
	const onSubmit = async (values: statusForm) => {
		if (isUpdate) {
			await updateColumn({
				inputUpdate: values,
				columnId: String(statusId),
			})
		} else {
			await createColumn({
				...values,
				projectId: query.projectId,
			})
		}
	}

	const setEditForm = ({ title, color, id }: { title: string; color: string; id: number }) => {
		setStatusId(id)
		formSetting.reset({
			color,
			title,
		})
		setIsUpdate(true)
		onOpen()
	}

	const setIdColumnToDl = (id: number) => {
		setStatusId(id)
		onOpenDlColumn()
	}

	const setIdTaskToDl = (id: number) => {
		setTaskId(id)
		onOpenDlTask()
	}

	const addTaskByStatus = (id: number) => {
		setStatusId(id)
		onOpenAddTask()
	}

	const updateTask = (id: number) => {
		setTaskId(id)
		onOpenUpdateTask()
	}

	const detailTask = (id: number) => {
		setTaskId(id)
		onOpenDetailTask()
	}

	useEffect(() => {
		if (allStatusTasks?.statuses) {
			const newColumns = allStatusTasks.statuses.map((column) => {
				const newTasks = column.tasks?.map((task) => {
					return {
						...task,
						onOpenUpdate: updateTask,
						onOpenDelete: setIdTaskToDl,
						onOpenDetail: detailTask,
					}
				})
				return {
					...column,
					tasks: newTasks,
				}
			})
			setColumns(newColumns)
		}
	}, [allStatusTasks])

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (createColumnStatus == 'success' && dataCreateColumn) {
			setToast({
				type: createColumnStatus,
				msg: dataCreateColumn.message,
			})
			refetchStatusTasks()
			refetchActivitiesProject()
			onClose()
			formSetting.reset({
				color: '',
				title: '',
			})
			if (socket && projectId) {
				socket.emit('newProjectTaskBoard', projectId)
			}
		}
	}, [createColumnStatus])

	useEffect(() => {
		if (deleteColumnStatus == 'success' && dataDeleteColumn) {
			setToast({
				type: deleteColumnStatus,
				msg: dataDeleteColumn.message,
			})
			refetchStatusTasks()

			if (socket && projectId) {
				socket.emit('newProjectTaskBoard', projectId)
			}
		}
	}, [deleteColumnStatus])

	useEffect(() => {
		if (statusUpdateColumn == 'success' && dataUpdateColumn) {
			setToast({
				type: statusUpdateColumn,
				msg: dataUpdateColumn.message,
			})
			refetchStatusTasks()
			onClose()
			formSetting.reset({
				color: '',
				title: '',
			})

			if (socket && projectId) {
				socket.emit('newProjectTaskBoard', projectId)
			}
		}
	}, [statusUpdateColumn])

	// task
	useEffect(() => {
		if (deleteTaskStatus == 'success' && dataDeleteTask) {
			setToast({
				type: deleteTaskStatus,
				msg: dataDeleteTask.message,
			})
			refetchStatusTasks()

			if (socket && projectId) {
				socket.emit('newProjectTaskBoard', projectId)
			}
		}
	}, [deleteTaskStatus])

	// emit socket when change position column
	useEffect(() => {
		if (statusChangePosition == 'success' && socket && projectId) {
			socket.emit('newProjectTaskBoard', projectId)
		}
	}, [statusChangePosition])

	// emit socket when change position task
	useEffect(() => {
		if (statusChangeTaskPosition == 'success' && socket && projectId) {
			socket.emit('newProjectTaskBoard', projectId)
		}
	}, [statusChangeTaskPosition])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && projectId) {
			socket.emit('joinRoomProjectTaskBoard', projectId)

			socket.on('getNewProjectTaskBoard', () => {
				refetchStatusTasks()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && projectId) {
				socket.emit('leaveRoomProjectTaskBoard', projectId)
			}
		}
		return leaveRoom
	}, [socket, projectId])

	const onDragEnd = (result: DropResult) => {
		if (result.destination) {
			const destination = result.destination
			const source = result.source
			if (destination.droppableId == 'ALL-COLUMNS') {
				if (columns) {
					const column1 = columns[source.index]
					const column2 = columns[destination.index]
					const data = [...columns]
					data?.splice(source.index, 1)
					data?.splice(destination.index, 0, column1)
					setColumns(data)
					changePosition({
						idStatus1: column1.id,
						idStatus2: column2.id,
						projectId: Number(query.projectId),
					})
				}
				return
			}

			if (
				destination.droppableId == source.droppableId &&
				destination.index == source.index
			) {
				return
			}

			if (destination.droppableId == source.droppableId) {
				const column = columns?.find((value: any) => {
					return value.id == source.droppableId
				})
				if (column?.tasks) {
					const task1 = column.tasks[Number(source.index)]
					const task2 = column.tasks[Number(destination.index)]

					column.tasks.splice(source.index, 1)
					column.tasks.splice(destination.index, 0, task1)

					const data = columns.map((item) => {
						if (item.id == Number(column.id)) {
							return column
						}
						return item
					})
					setColumns(data)
					changeTaskPosition({
						id1: task1.id,
						id2: task2.id,
						status1: column.id,
						status2: column.id,
					})
				}
			} else {
				const column1 = columns?.find((value: any) => {
					return value.id == source.droppableId
				})
				const column2 = columns?.find((value: any) => {
					return value.id == destination.droppableId
				})
				if (column1?.tasks && column2?.tasks) {
					const task1 = column1?.tasks[source.index]
					const task2 = column2?.tasks[destination.index]
					column1.tasks.splice(source.index, 1)
					column2.tasks.splice(destination.index, 0, task1)
					const data = columns?.map((e) => {
						if (e.id == column1.id) {
							return column1
						}
						if (e.id == column2.id) {
							return column2
						}
						return e
					})
					setColumns(data)
					if (!task2) {
						changeTaskPosition({
							id1: task1.id,
							status1: column1.id,
							status2: column2.id,
						})
						return
					}
					changeTaskPosition({
						id1: task1.id,
						id2: task2.id,
						status1: column1.id,
						status2: column2.id,
					})
				}
			}
		}

		return
	}

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Task board of project {projectId}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<HStack
				divider={
					<StackDivider borderColor={colorMode == 'light' ? 'gray.200' : 'gray.700'} />
				}
				spacing={4}
				alignItems={'center'}
				paddingBottom={8}
			>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					{projectDetail?.project?.name}
				</Text>
				{projectDetail?.project?.client && (
					<Tooltip hasArrow label="Client" bg="gray.300" color="black">
						<Avatar
							size="sm"
							name={projectDetail.project.client.name}
							src={projectDetail.project.client.avatar?.url}
						/>
					</Tooltip>
				)}
				<Tooltip hasArrow label="Employees" bg="gray.300" color="black">
					<AvatarGroup size="sm" max={2}>
						{projectDetail?.project?.employees &&
							projectDetail.project.employees.map((employee) => (
								<Avatar
									key={employee.id}
									name={employee.name}
									src={employee.avatar?.url}
								/>
							))}
					</AvatarGroup>
				</Tooltip>
			</HStack>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="ALL-COLUMNS" direction="horizontal" type="column">
					{(provided) => (
						<Box
							w={'full'}
							display={'flex'}
							overflow={'auto'}
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{columns.map((column, key: number) => (
								<Column
									isDragDisabled={currentUser?.role === 'Admin' ? false : true}
									setEditForm={setEditForm}
									key={column.id}
									column={column}
									index={key}
									setIdColumnToDl={setIdColumnToDl}
									addTaskByStatus={addTaskByStatus}
								/>
							))}
							{provided.placeholder}
							<Box
								cursor={'pointer'}
								marginRight={10}
								borderRadius={10}
								w={350}
								minW={350}
								height={'min-content'}
								paddingBlock={2}
								onClick={() => {
									onOpen()
									setIsUpdate(false)
								}}
							>
								<HStack
									bg={colorMode == 'light' ? 'gray.100' : '#3a4f781f'}
									padding={4}
									borderRadius={10}
									spacing={4}
								>
									<HStack spacing={4} alignItems={'center'}>
										<IoIosAdd fontSize={'20px'} />
										<Text>Add new status</Text>
									</HStack>
								</HStack>
							</Box>
						</Box>
					)}
				</Droppable>
			</DragDropContext>
			<Modal
				title={isUpdate ? 'Update status column' : 'Add new'}
				size="lg"
				isOpen={isOpen}
				onClose={() => onClose()}
				onOpen={() => onOpen()}
				onOk={() => {
					alert('sdsddssd')
				}}
				form={'status'}
			>
				<HStack
					pos="relative"
					paddingInline={6}
					spacing={4}
					as={'form'}
					h="auto"
					id="status"
					alignItems="start"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						type={'text'}
						form={formSetting}
						name={'title'}
						label={'Title'}
						required
						placeholder="Enter status title"
						icon={<MdOutlineSubtitles fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
					<Input
						type={'color'}
						form={formSetting}
						name={'color'}
						label={'Color'}
						required
						icon={<AiOutlineBgColors fontSize={'20px'} color="gray" opacity={0.6} />}
						placeholder="Enter status title"
					/>
				</HStack>
			</Modal>
			{/* alert dialog when delete column */}
			<AlertDialog
				handleDelete={() => {
					deleteColumn(String(statusId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlColumn}
				onClose={onCloseDlColumn}
			/>

			{/* alert dialog when delete task */}
			<AlertDialog
				handleDelete={() => {
					deleteTask(String(taskId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlTask}
				onClose={onCloseDlTask}
			/>

			<Drawer size="xl" title="Add New Task" onClose={onCloseAddTask} isOpen={isOpenAddTask}>
				<AddTask statusId={statusId} onCloseDrawer={onCloseAddTask} />
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
		</Box>
	)
}

taskBoard.getLayout = ProjectLayout

export default taskBoard
