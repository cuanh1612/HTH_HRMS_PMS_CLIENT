import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	GridItem,
	HStack, Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, Select, SelectCustom, SelectMany } from 'components/form'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { createTaskMutation } from 'mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
	allProjectsNormalQuery,
	allStatusQuery,
	allStatusTasksQuery,
	allTaskCategoriesQuery,
	detailProjectQuery, milestonesByProjectNormalQuery
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineSubtitles } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import TaskCategory from 'src/pages/task-categories'
import { IOption } from 'type/basicTypes'
import { createProjectTaskForm } from 'type/form/basicFormType'
import { dataTaskPriority } from 'utils/basicData'
import { CreateProjectTaskValidate } from 'utils/validate'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddTaskProps {
	onCloseDrawer?: () => void
}

export default function AddTask({ onCloseDrawer }: IAddTaskProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//state -------------------------------------------------------------
	const [optionTaskCategories, setOptionTaskCategories] = useState<IOption[]>([])
	const [optionProjects, setOptionProjects] = useState<IOption[]>([])
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [description, setDescription] = useState<string>('')
	const [optionStatus, setOptionStatus] = useState<IOption[]>([])
	const [optionMilestones, setOptionMilestones] = useState<IOption[]>([])
	const [selectProjectId, setSelectProjectId] = useState<string | number>()
	const [selectedStatus, setSelectedStatus] = useState<IOption>()
	const [selectedEmployees, setSelectedEmployees] = useState<IOption[]>()

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
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, selectProjectId)
	const { data: dataAllStatus } = allStatusQuery(isAuthenticated, selectProjectId)
	const { data: dataAllProjects } = allProjectsNormalQuery(isAuthenticated)

	const { data: dataAllMilestones } = milestonesByProjectNormalQuery(
		isAuthenticated,
		selectProjectId
	)
	// get all status tasks
	const { mutate: refetchStatusTasks } = allStatusTasksQuery(isAuthenticated, selectProjectId)

	//mutation -----------------------------------------------------------
	const [mutateCreTask, { status: statusCreTask, data: dataCreTask }] =
		createTaskMutation(setToast)

	// setForm and submit form create new task discussion room -----------
	const formSetting = useForm<createProjectTaskForm>({
		defaultValues: {
			project: undefined,
			name: undefined,
			task_category: undefined,
			start_date: undefined,
			deadline: undefined,
			employees: [],
			status: undefined,
			milestone: undefined,
			priority: undefined,
		},
		resolver: yupResolver(CreateProjectTaskValidate),
	})

	const { handleSubmit } = formSetting

	//Function -----------------------------------------------------------
	const onSubmitTask = (value: createProjectTaskForm) => {
		value.description = description
		value.assignBy = currentUser?.id
		mutateCreTask(value)
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

	//Handle change project select
	const onChangeProject = (projectId: string | number) => {
		setSelectProjectId(projectId)
		

		//Clear data when change project
		setSelectedStatus({
			label: <Text color={"gray.400"}>Select ...</Text>,
			value: undefined
		})

		setSelectedEmployees([])
	}

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

	//Set option select status when have data all status
	useEffect(() => {
		if (dataAllStatus?.statuses) {
			//Set data option satuses state
			let newOptionStatus: IOption[] = []

			dataAllStatus.statuses.map((status) => {
				newOptionStatus.push({
					label: status.title,
					value: status.id,
				})
			})

			setOptionStatus(newOptionStatus)
		}
	}, [dataAllStatus])

	//Set option select milestiones when have data all milestones
	useEffect(() => {
		if (dataAllMilestones?.milestones) {
			//Set data option milestones state
			let newOptionMilestones: IOption[] = []

			dataAllMilestones.milestones.map((milestone) => {
				newOptionMilestones.push({
					label: milestone.title,
					value: milestone.id,
				})
			})

			setOptionMilestones(newOptionMilestones)
		}
	}, [dataAllMilestones])

	//Note when request success
	useEffect(() => {
		if (statusCreTask === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataCreTask?.message as string,
			})
			refetchStatusTasks()
		}
	}, [statusCreTask])

	//Set data option employees state
	useEffect(() => {
		if (dataDetailProject?.project && dataDetailProject.project.employees) {
			let newOptionEmployees: IOption[] = []

			dataDetailProject.project.employees.map((employee) => {
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
	}, [dataDetailProject])

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

	//Set data option task categories when have data from request
	useEffect(() => {
		if (dataAllProjects?.projects) {
			const newOptionProject: IOption[] = dataAllProjects.projects.map((project) => {
				return {
					value: project.id,
					label: project.name,
				}
			})

			setOptionProjects(newOptionProject)
		}
	}, [dataAllProjects])

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
					<SelectCustom
						name="project"
						label="Project"
						required={true}
						form={formSetting}
						placeholder={'Select Project'}
						options={optionProjects}
						onChangeValue={onChangeProject}
					/>
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
						required={true}
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
						selectedOptions={selectedEmployees}
					/>
				</GridItem>

				<GridItem w="100%" colSpan={2}>
					<VStack align={'start'}>
						<Text fontWeight={'normal'} color={'gray.400'}>
							Description
						</Text>
						<ReactQuill
							placeholder="Enter you text"
							modules={{
								toolbar: [
									['bold', 'italic', 'underline', 'strike'], // toggled buttons
									['blockquote', 'code-block'],

									[{ header: 1 }, { header: 2 }], // custom button values
									[{ list: 'ordered' }, { list: 'bullet' }],
									[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
									[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
									[{ direction: 'rtl' }], // text direction

									[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
									[{ header: [1, 2, 3, 4, 5, 6, false] }],

									[{ color: [] }, { background: [] }], // dropdown with defaults from theme
									[{ font: [] }],
									[{ align: [] }],

									['clean'], // remove formatting button
								],
							}}
							value={description}
							onChange={onChangeDescription}
						/>
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
			{statusCreTask == 'running' && <Loading />}

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
