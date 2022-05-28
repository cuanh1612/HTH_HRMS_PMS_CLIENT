import {
	Avatar,
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Input as ChakraInput,
	Text,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, SelectCustom, TimePicker } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createTimeLogMutation } from 'mutations/timeLog'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import {
	allTasksByProjectQuery,
	detailProjectQuery,
	detailTaskQuery,
	timeLogsByProjectQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiMemoryCard } from 'react-icons/bi'
import { BsCalendarDate } from 'react-icons/bs'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { createProjectTimeLogForm } from 'type/form/basicFormType'
import { projectMutaionResponse } from 'type/mutationResponses'
import { compareDateTime } from 'utils/time'
import { CreateProjectTimeLogValidate } from 'utils/validate'

export interface IAddTimeLogProps {
	onCloseDrawer: () => void
}

export default function AddTimeLog({ onCloseDrawer }: IAddTimeLogProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//State -------------------------------------------------------------
	const [optionTasks, setOptionTasks] = useState<IOption[]>([])
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [selectedTaskId, setSelectedTaskId] = useState<number | string>()
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<IOption>()

	//Query -------------------------------------------------------------
	// get data detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)

	const { data: allTasksProject } = allTasksByProjectQuery(isAuthenticated, projectId as string)

	const { data: detailTaskSelected } = detailTaskQuery(isAuthenticated, selectedTaskId)

	// refetch all time log by project
	const { mutate: refetchTimeLogs } = timeLogsByProjectQuery(isAuthenticated, projectId)

	//mutation -----------------------------------------------------------
	const [mutateCreTimeLog, { status: statusCreTimeLog, data: dataCreTimeLog }] =
		createTimeLogMutation(setToast)

	// setForm and submit form create new project timelog -------------------------------
	const formSetting = useForm<createProjectTimeLogForm>({
		defaultValues: {
			task: undefined,
			employee: undefined,
			starts_on_date: undefined,
			ends_on_date: undefined,
			starts_on_time: '',
			ends_on_time: '',
			memo: '',
		},
		resolver: yupResolver(CreateProjectTimeLogValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createProjectTimeLogForm) => {
		if (!projectId) {
			setToast({
				msg: 'Not found project to add new time log',
				type: 'error',
			})
		} else {
			values.project = Number(projectId)
			const invalid = compareDateTime(
				new Date(values.starts_on_date).toLocaleDateString(),
				new Date(values.ends_on_date).toLocaleDateString(),
				values.starts_on_time,
				values.ends_on_time
			)
			if (invalid) {
				setToast({
					msg: 'The end time must be greater than the start time of the time log',
					type: 'error',
				})
			} else {
				mutateCreTimeLog(values)
			}
		}
	}

	//Function ------------------------------------------------------------------
	//handle when change stask
	const onChangeTask = (taskId: string | number) => {
		setSelectedTaskId(taskId)
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

	//Set data option tasks state
	useEffect(() => {
		if (allTasksProject && allTasksProject.tasks) {
			let newOptionTasks: IOption[] = []

			allTasksProject.tasks.map((task) => {
				newOptionTasks.push({
					label: task.name,
					value: task.id,
				})
			})

			setOptionTasks(newOptionTasks)
		}
	}, [allTasksProject])

	//Set data option employees state
	useEffect(() => {
		if (detailTaskSelected && detailTaskSelected.task?.employees) {
			let newOptionEmployees: IOption[] = []

			detailTaskSelected.task.employees.map((employee) => {
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

			//When refetch data tasks, value employeeid existing, need to clear option selected employee and employee id form
			setOptionEmployees(newOptionEmployees)
			setSelectedEmployeeId({
				label: <Text color={'gray.400'}>Select...</Text>,
				value: undefined,
			})
			formSetting.setValue('employee', undefined)
		}
	}, [detailTaskSelected])

	//Note when request success
	useEffect(() => {
		if (statusCreTimeLog === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataCreTimeLog?.message as string,
			})

			refetchTimeLogs()
		}
	}, [statusCreTimeLog])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack align={'start'}>
							<Text color={'gray.400'}>Project</Text>
							<ChakraInput
								type={'text'}
								value={dataDetailProject?.project?.name}
								disabled
							/>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="task"
							label="task"
							form={formSetting}
							options={optionTasks}
							required={true}
							onChangeValue={onChangeTask}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="employee"
							label="employee"
							form={formSetting}
							options={optionEmployees}
							required={true}
							selectedOption={selectedEmployeeId}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="memo"
							label="Memo"
							icon={<BiMemoryCard fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter Time Log Memo"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="starts_on_date"
							label="Start On Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<TimePicker
							form={formSetting}
							name={'starts_on_time'}
							label={'Starts On Time'}
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="ends_on_date"
							label="Ends On Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<TimePicker
							form={formSetting}
							name={'ends_on_time'}
							label={'Ends On Time'}
							required
						/>
					</GridItem>
				</Grid>

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
				{statusCreTimeLog == 'running' && <Loading />}
			</Box>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	//Get accesstoken
	const getAccessToken: { accessToken: string; code: number; message: string; success: boolean } =
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh_token`, {
			method: 'GET',
			headers: {
				cookie: context.req.headers.cookie,
			} as HeadersInit,
		}).then((e) => e.json())

	//Redirect login page when error
	if (getAccessToken.code !== 200) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}

	//Check assigned
	const checkAsignedProject: projectMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-asigned`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!checkAsignedProject.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {},
	}
}
