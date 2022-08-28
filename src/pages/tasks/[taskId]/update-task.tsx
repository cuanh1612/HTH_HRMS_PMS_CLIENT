import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	GridItem,
	HStack,
	Input as CInput,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, Select, SelectCustom, SelectMany } from 'components/form'
import { Editor, Loading } from 'components/common'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { updateTaskMutation } from 'mutations/task'
import { useRouter } from 'next/router'
import {
	milestonesByProjectNormalQuery,
	allStatusQuery,
	detailTaskQuery,
	allTaskCategoriesQuery,
	allTasksQuery,
	allTasksCalendarQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineSubtitles } from 'react-icons/md'
import TaskCategory from 'src/pages/task-categories'
import { IOption } from 'type/basicTypes'
import { updateProjectTaskForm } from 'type/form/basicFormType'
import { dataTaskPriority } from 'utils/basicData'
import { UpdateProjectTaskValidate } from 'utils/validate'

export interface IUpdateTaskProps {
	onCloseDrawer?: () => void
	taskIdProp?: string | number
}

export default function UpdateTask({ onCloseDrawer, taskIdProp }: IUpdateTaskProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const router = useRouter()
	const { taskId: taskIdRouter } = router.query

	//state -------------------------------------------------------------
	const [optionTaskCategories, setOptionTaskCategories] = useState<IOption[]>([])
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionStatus, setOptionStatus] = useState<IOption[]>([])
	const [selectedStatus, setSelectedStatus] = useState<IOption>()
	const [description, setDescription] = useState<string>('')
	const [selectedOptionEmployees, setSelectedOptionEmployees] = useState<IOption[]>([])
	const [optionMilestones, setOptionMilestones] = useState<IOption[]>([])
	const [projectId, setProjectId] = useState<number | string>()
	const [selectedMilestone, setSelectedMilestone] = useState<IOption>()

	//Setup modal -------------------------------------------------------
	const {
		isOpen: isOpenTaskCategory,
		onOpen: onOpenTaskCategory,
		onClose: onCloseTaskCategory,
	} = useDisclosure()

	const {
		isOpen: isOpenOtherDetails,
		onOpen: onOpenOtherDetails,
		onClose: onCloseOtherDetails,
	} = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataTaskCategories } = allTaskCategoriesQuery()
	const { data: dataDetailTask } = detailTaskQuery(
		isAuthenticated,
		taskIdProp || (taskIdRouter as string)
	)

	const { data: dataAllStatus } = allStatusQuery(isAuthenticated, projectId)
	const { data: dataAllMilestones } = milestonesByProjectNormalQuery(isAuthenticated, projectId)

	// refetch all tasks
	const { mutate: refetchTasks } = allTasksQuery(isAuthenticated)

	// refetch task in calendar
	const { mutate: refetchTasksCalendar } = allTasksCalendarQuery({isAuthenticated})

	//mutation -----------------------------------------------------------
	const [mutateUpTask, { status: statusUpTask, data: dataUpTask }] = updateTaskMutation(setToast)

	// setForm and submit form update new task discussion room -----------
	const formSetting = useForm<updateProjectTaskForm>({
		defaultValues: {
			name: '',
			task_category: undefined,
			start_date: undefined,
			deadline: undefined,
			employees: [],
			status: undefined,
			milestone: undefined,
			priority: '',
		},
		resolver: yupResolver(UpdateProjectTaskValidate),
	})

	const { handleSubmit } = formSetting

	//Function -----------------------------------------------------------
	const onSubmitTask = (values: updateProjectTaskForm) => {
		if (!projectId) {
			setToast({
				msg: 'Not found project to add new task',
				type: 'error',
			})
		} else {
			values.project = Number(projectId as string)
			values.description = description
			mutateUpTask({
				inputUpdate: values,
				taskId: taskIdProp || (taskIdRouter as string),
			})
		}
	}

	const onChangeDescription = (value: string) => {
		setDescription(value)
	}

	//Handle trigger other detail
	const onTriggerOtherDetails = () => {
		if (isOpenOtherDetails) {
			onCloseOtherDetails()
		} else {
			onOpenOtherDetails()
		}
	}

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

	//Set option select milestones when have data all milestones
	useEffect(() => {
		if (dataAllMilestones?.milestones) {
			//Set data option milestones state
			const newOptionMilestones: IOption[] = []

			dataAllMilestones.milestones.map((milestone) => {
				newOptionMilestones.push({
					label: milestone.title,
					value: milestone.id,
				})
			})

			setOptionMilestones(newOptionMilestones)
		}
	}, [dataAllMilestones])

	//Set data form when have data detail task
	useEffect(() => {
		if (dataDetailTask?.task) {
			setDescription(dataDetailTask.task.description)
			setProjectId(dataDetailTask.task.project.id)
			if (dataDetailTask.task.status) {
				setSelectedStatus({
					label: dataDetailTask.task.status.title,
					value: dataDetailTask.task.status.id,
				})
			}
			if (dataDetailTask.task.milestone) {
				setSelectedMilestone({
					label: dataDetailTask.task.milestone.title,
					value: dataDetailTask.task.milestone.id,
				})
			}

			formSetting.reset({
				name: dataDetailTask?.task?.name,
				start_date: dataDetailTask?.task?.start_date,
				deadline: dataDetailTask?.task?.deadline,
				task_category: dataDetailTask?.task?.task_category?.id,
				employees: dataDetailTask?.task?.employees.map((employee) => employee.id),
				status: dataDetailTask?.task?.status?.id,
				milestone: dataDetailTask?.task?.milestone?.id || undefined,
				priority: dataDetailTask?.task?.priority || '',
			})
		}

		//Set data option employees state
		if (dataDetailTask?.task?.project && dataDetailTask.task.project.employees) {
			const newOptionEmployees: IOption[] = []

			dataDetailTask.task.project.employees.map((employee) => {
				newOptionEmployees.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text>{employee.email}</Text>
							</HStack>
						</>
					),
					value: employee.id,
				})
			})

			setOptionEmployees(newOptionEmployees)
		}

		//Set data option employees selected state
		if (dataDetailTask?.task?.employees) {
			const newOptionSelectedEmployees: IOption[] = []

			dataDetailTask.task.employees.map((employee) => {
				newOptionSelectedEmployees.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text>{employee.email}</Text>
							</HStack>
						</>
					),
					value: employee.id,
				})
			})

			setSelectedOptionEmployees(newOptionSelectedEmployees)
		}
	}, [dataDetailTask])

	//Set option select status when have data all status
	useEffect(() => {
		if (dataAllStatus?.statuses) {
			//Set data option statuses state
			const newOptionStatus: IOption[] = []

			dataAllStatus.statuses.map((status) => {
				newOptionStatus.push({
					label: status.title,
					value: status.id,
				})
			})

			setOptionStatus(newOptionStatus)
		}
	}, [dataAllStatus])

	//Note when request success
	useEffect(() => {
		if (statusUpTask === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: statusUpTask,
				msg: dataUpTask?.message as string,
			})

			refetchTasks()
			refetchTasksCalendar()

			if (socket) {
				socket.emit('newTask')
			}
		}
	}, [statusUpTask])

	//Set data option task categories when have data from request
	useEffect(() => {
		if (dataTaskCategories?.taskCategories) {
			const newOptionTaskCategories: IOption[] = dataTaskCategories.taskCategories.map(
				(taskCategory) => {
					return {
						value: taskCategory.id.toString(),
						label: taskCategory.name,
					}
				}
			)

			setOptionTaskCategories(newOptionTaskCategories)
		}
	}, [dataTaskCategories])

	return (
		<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmitTask)}>
			<Grid templateColumns="repeat(2, 1fr)" gap={6}>
				<GridItem w="100%" colSpan={[2, 1]}>
					<Input
						name="name"
						label="Task Name"
						icon={<MdOutlineSubtitles fontSize={'20px'} color="gray" opacity={0.6} />}
						form={formSetting}
						placeholder="Enter Note Title"
						type="text"
						required
					/>
				</GridItem>

				<GridItem w="100%" colSpan={[2, 1]}>
					<Select
						name="task_category"
						label="Task Category"
						required={false}
						form={formSetting}
						placeholder={'Select Task Category'}
						options={optionTaskCategories}
						isModal={true}
						onOpenModal={onOpenTaskCategory}
					/>
				</GridItem>

				<GridItem w="100%" colSpan={[2, 1]}>
					<VStack align={'start'}>
						<Text color={'gray.400'}>Project</Text>
						<CInput
							type={'text'}
							value={dataDetailTask?.task?.project.name}
							disabled
						/>
					</VStack>
				</GridItem>

				<GridItem w="100%" colSpan={[2, 1]}>
					<Input
						name="start_date"
						label="Start Date"
						icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
						form={formSetting}
						type="date"
						required
					/>
				</GridItem>

				<GridItem w="100%" colSpan={[2, 1]}>
					<Input
						name="deadline"
						label="Due Date"
						icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
						form={formSetting}
						type="date"
						required
					/>
				</GridItem>

				<GridItem w="100%" colSpan={[2, 1]}>
					<SelectCustom
						name="status"
						label="Status"
						form={formSetting}
						options={optionStatus}
						required
						selectedOption={selectedStatus}
					/>
				</GridItem>

				<GridItem w="100%" colSpan={[2]}>
					<SelectMany
						form={formSetting}
						label={'Select Employee'}
						name={'employees'}
						required={true}
						options={optionEmployees}
						selectedOptions={selectedOptionEmployees}
					/>
				</GridItem>

				<GridItem w="100%" colSpan={2}>
					<VStack align={'start'}>
						<Text fontWeight={'normal'} color={'gray.400'}>
							Description
						</Text>
						<Editor note={description} onChangeNote={onChangeDescription}/>
					</VStack>
				</GridItem>
			</Grid>

			<Divider marginY={6} />
			<HStack onClick={onTriggerOtherDetails} cursor={'pointer'}>
				{isOpenOtherDetails ? <AiFillCaretUp /> : <AiFillCaretDown />}
				<Text fontSize={20} fontWeight={'semibold'}>
					Other Details
				</Text>
			</HStack>

			{isOpenOtherDetails && (
				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="milestone"
							label="Milestone"
							required={false}
							form={formSetting}
							placeholder={'Select Milestone'}
							options={optionMilestones}
							selectedOption={selectedMilestone}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="priority"
							label="Priority"
							form={formSetting}
							options={dataTaskPriority}
							required={false}
						/>
					</GridItem>
				</Grid>
			)}

			<Button
				color={'white'}
				bg={'hu-Green.normal'}
				transform="auto"
				_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
				_active={{
					bg: 'hu-Green.normalA',
					scale: 1,
				}}
				leftIcon={<AiOutlineCheck />}
				mt={6}
				type="submit"
			>
				Save
			</Button>
			{statusUpTask == 'running' && <Loading />}

			{/* Modal department and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenTaskCategory}
				onOpen={onOpenTaskCategory}
				onClose={onCloseTaskCategory}
				title="Task Category"
			>
				<TaskCategory />
			</Modal>
		</Box>
	)
}
