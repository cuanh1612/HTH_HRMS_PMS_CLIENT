import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Divider,
	Grid,
	GridItem,
	HStack,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderTrack,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, InputNumber, Select, SelectCustom } from 'components/form'
import { Loading } from 'components/common'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { updateProjectMutation } from 'mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
	allProjectsQuery,
	detailProjectQuery,
	allClientsQuery,
	allDepartmentsQuery,
	allProjectCategoriesQuery,
	allProjectsByCurrentUserQuery,
} from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { updateProjectForm } from 'type/form/basicFormType'
import { dataCurrency, dataProjectStatus } from 'utils/basicData'
import { createProjectValidate } from 'utils/validate'
import Department from '../departments'
import ProjectCategory from '../project-categories'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IUpdateProjectProps {
	onCloseDrawer?: () => void
	projectIdUpdate?: number
}

export default function UpdateProject({ onCloseDrawer, projectIdUpdate }: IUpdateProjectProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenProjectCategory,
		onOpen: onOpenProjectCategory,
		onClose: onCloseProjectCategory,
	} = useDisclosure()

	const {
		isOpen: isOpenDepartment,
		onOpen: onOpenDepartment,
		onClose: onCloseDepartment,
	} = useDisclosure()

	//State ----------------------------------------------------------------------
	const [summary, setSummary] = useState<string>('')
	const [notes, setNotes] = useState<string>('')
	const [optionClients, setOptionClients] = useState<IOption[]>([])
	const [optionProjectCategories, setOptionProjectCategories] = useState<IOption[]>([])
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])
	const [isSendTaskNoti, setIsSendTaskNoti] = useState<boolean>(true)

	//query ----------------------------------------------------------------------
	// get all clients
	const { data: allClients } = allClientsQuery(isAuthenticated)

	// get all project categories
	const { data: allProjectCategories } = allProjectCategoriesQuery(isAuthenticated)

	// get all department
	const { data: allDepartments } = allDepartmentsQuery(isAuthenticated)

	// get detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectIdUpdate)

	// refetch all Project
	const { mutate: refetchAllProjects } = allProjectsQuery(isAuthenticated)

	//  refetch all Project by user
	const { mutate: refetchAllProjectsByUser } = allProjectsByCurrentUserQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateUpProject, { status: statusUpProject, data: dataUpProject }] =
		updateProjectMutation(setToast)

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

	//Set data option clients state
	useEffect(() => {
		if (allClients && allClients.clients) {
			let newOptionClients: IOption[] = []

			allClients.clients.map((client) => {
				newOptionClients.push({
					label: (
						<>
							<HStack>
								<Avatar size={'xs'} name={client.name} src={client.avatar?.url} />
								<Text>{client.email}</Text>
							</HStack>
						</>
					),
					value: client.id,
				})
			})

			setOptionClients(newOptionClients)
		}
	}, [allClients])

	//Set sate option when have data all project categories
	useEffect(() => {
		if (allProjectCategories?.projectCategories) {
			const newOptionProjectCategories: IOption[] =
				allProjectCategories.projectCategories.map((projectCategory) => {
					return {
						value: projectCategory.id,
						label: projectCategory.name,
					}
				})

			setOptionProjectCategories(newOptionProjectCategories)
		}
	}, [allProjectCategories])

	//Set sate option when have data all departments
	useEffect(() => {
		if (allDepartments?.departments) {
			const newOptionDepartments: IOption[] = allDepartments.departments.map((department) => {
				return {
					value: department.id,
					label: department.name,
				}
			})

			setOptionDepartments(newOptionDepartments)
		}
	}, [allDepartments])

	//Note when request success
	useEffect(() => {
		if (statusUpProject === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataUpProject?.message as string,
			})

			refetchAllProjects()
			refetchAllProjectsByUser()
		}
	}, [statusUpProject])

	//Set again data form when have detail data project
	useEffect(() => {
		if (dataDetailProject?.project) {
			setSummary(dataDetailProject.project.project_summary || '')
			setNotes(dataDetailProject.project.notes || '')
			setIsSendTaskNoti(dataDetailProject.project.send_task_noti)

			formSetting.reset({
				name: dataDetailProject.project.name,
				start_date: dataDetailProject.project.start_date,
				deadline: dataDetailProject.project.deadline,
				project_category: dataDetailProject.project.project_category?.id,
				department: dataDetailProject.project.department?.id,
				client: dataDetailProject.project.client?.id,
				currency: dataDetailProject.project.currency,
				project_budget: dataDetailProject.project.project_budget,
				hours_estimate: dataDetailProject.project.hours_estimate,
				project_status: dataDetailProject.project.project_status,
			})
		}
	}, [dataDetailProject])

	// setForm and submit form update new project -------------------------------
	const formSetting = useForm<updateProjectForm>({
		defaultValues: {
			name: '',
			start_date: undefined,
			deadline: undefined,
			project_category: undefined,
			department: undefined,
			client: undefined,
			currency: undefined,
			project_budget: 0,
			hours_estimate: 0,
			project_status: undefined,
		},
		resolver: yupResolver(createProjectValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateProjectForm) => {
		if (new Date(values.deadline) < new Date(values.start_date)) {
			setToast({
				msg: 'The deadline time must be greater than the project start date',
				type: 'warning',
			})
		} else if (!projectIdUpdate) {
			setToast({
				msg: 'Not found project to update',
				type: 'warning',
			})
		} else {
			//Update project
			values.project_summary = summary
			values.notes = notes
			values.send_task_noti = isSendTaskNoti

			mutateUpProject({
				inputUpdate: values,
				projectId: projectIdUpdate,
			})
		}
	}

	//Funtion -------------------------------------------------------------------
	const onChangeSummary = (value: string) => {
		setSummary(value)
	}

	const onChangeNotes = (value: string) => {
		setNotes(value)
	}

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="name"
							label="Project Name"
							icon={
								<MdOutlineDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Write a project name"
							type="text"
							required
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
							label="Deadline"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="project_category"
							label="Project Category"
							required={false}
							form={formSetting}
							placeholder={'Select Project Category'}
							options={optionProjectCategories}
							isModal={true}
							onOpenModal={onOpenProjectCategory}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="department"
							label="Department"
							required={false}
							form={formSetting}
							placeholder={'Select Project Category'}
							options={optionDepartments}
							isModal={true}
							onOpenModal={onOpenDepartment}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="client"
							label="Client"
							required={false}
							form={formSetting}
							placeholder={'Select Project Category'}
							options={optionClients}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Project Summary
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
								value={summary}
								onChange={onChangeSummary}
							/>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Notes
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
								value={notes}
								onChange={onChangeNotes}
							/>
						</VStack>
					</GridItem>

					<GridItem zIndex={20} w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="project_status"
							label="Project Status"
							required={false}
							form={formSetting}
							options={dataProjectStatus}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Text fontWeight={'normal'} color={'gray.400'}>
							Project Completion Status
						</Text>
						<Slider
							mt={2}
							id="slider"
							defaultValue={dataDetailProject?.project?.Progress || 0}
							min={0}
							max={100}
							colorScheme="teal"
							isDisabled={true}
						>
							<SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
								25%
							</SliderMark>
							<SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
								50%
							</SliderMark>
							<SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
								75%
							</SliderMark>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
						</Slider>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Checkbox
							isChecked={isSendTaskNoti}
							onChange={() => setIsSendTaskNoti(!isSendTaskNoti)}
						>
							Send task notice
						</Checkbox>
					</GridItem>
				</Grid>

				<Divider marginY={6} />
				<HStack cursor={'pointer'}>
					<Text fontSize={20} fontWeight={'semibold'}>
						Other Details
					</Text>
				</HStack>

				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="currency"
							label="Currency"
							required={false}
							form={formSetting}
							options={dataCurrency}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<InputNumber
							name="project_budget"
							label="Project Budget"
							required={false}
							form={formSetting}
							min={0}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<InputNumber
							name="hours_estimate"
							label="Hourse Estimate (In Hours)"
							required={false}
							form={formSetting}
							min={0}
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

				{statusUpProject === 'running' && <Loading />}
			</Box>

			{/* Modal project category and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenProjectCategory}
				onOpen={onOpenProjectCategory}
				onClose={onCloseProjectCategory}
				title="Project Category"
			>
				<Text>
					<ProjectCategory />
				</Text>
			</Modal>

			{/* Modal department and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenDepartment}
				onOpen={onOpenDepartment}
				onClose={onCloseDepartment}
				title="Department"
			>
				<Text>
					<Department />
				</Text>
			</Modal>
		</>
	)
}
