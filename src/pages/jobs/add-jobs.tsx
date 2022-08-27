import {
	Avatar,
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, InputNumber, SelectCustom, SelectMany } from 'components/form'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { createJobMutation } from 'mutations/job'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { allDepartmentsQuery, allEmployeesQuery } from 'queries'
import { allJobsQuery } from 'queries/job'
import { allJobTypesQuery } from 'queries/jobType'
import { allLocationsQuery } from 'queries/location'
import { allSkillsQuery } from 'queries/skill'
import { allWorkExperiencesQuery } from 'queries/workExperience'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { createJobForm } from 'type/form/basicFormType'
import { dataJobRate, dataJobStatus } from 'utils/basicData'
import { CreateJobValidate } from 'utils/validate'
import Department from '../departments'
import JobTypes from '../jobTypes'
import Locations from '../locations'
import AddSkillModal from '../skills/add-skills-modal'
import WorkExperiences from '../workExperiences'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddJobProps {
	onCloseDrawer?: () => void
}

export default function AddJob({ onCloseDrawer }: IAddJobProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------------
	// all departments
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])
	const [optionSkills, setOptionSkills] = useState<IOption[]>([])
	const [optionJobTypes, setOptionJobTypes] = useState<IOption[]>([])
	const [optionWorkExperiences, setOptionWorkExperiences] = useState<IOption[]>([])
	const [optionLocations, setOptionLocations] = useState<IOption[]>([])
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [jobDescription, setJobDescription] = useState<string>('')

	//Setup modal -------------------------------------------------------------
	const {
		isOpen: isOpenDepartment,
		onOpen: onOpenDepartment,
		onClose: onCloseDepartment,
	} = useDisclosure()

	const { isOpen: isOpenSkill, onOpen: onOpenSkill, onClose: onCloseSkill } = useDisclosure()
	const {
		isOpen: isOpenLocation,
		onOpen: onOpenLocation,
		onClose: onCloseLocation,
	} = useDisclosure()

	const {
		isOpen: isOpenJobType,
		onOpen: onOpenJobType,
		onClose: onCloseJobType,
	} = useDisclosure()

	const {
		isOpen: isOpenWorkExperience,
		onOpen: onOpenWorkExperience,
		onClose: onCloseWorkExperience,
	} = useDisclosure()

	//Query -------------------------------------------------------------------
	// get all department
	const { data: dataDepartments, error: errorDepartments } = allDepartmentsQuery(isAuthenticated)
	// get all skills
	const { data: allSkills } = allSkillsQuery(isAuthenticated)
	// get all locations
	const { data: allLocations } = allLocationsQuery()
	// get all employees
	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)
	// get all job type
	const { data: allJobType } = allJobTypesQuery(isAuthenticated)
	// get all work experience
	const { data: allWorkExperience } = allWorkExperiencesQuery(isAuthenticated)
	// refetch when add new jobs
	const { mutate: refetchAllJobs } = allJobsQuery()

	//mutation ----------------------------------------------------------------
	const [mutateCreJob, { status: statusCreJob, data: dataCreJob }] = createJobMutation(setToast)

	//Function -----------------------------------------------------------------
	const onChangeDescription = (value: string) => {
		setJobDescription(value)
	}

	// setForm and submit form create new job ---------------------------------
	const formSetting = useForm<createJobForm>({
		defaultValues: {
			title: '',
			skills: undefined,
			locations: undefined,
			department: undefined,
			status: undefined,
			total_openings: 1,
			job_type: undefined,
			work_experience: undefined,
			recruiter: undefined,
			starting_salary_amount: 1,
			starts_on_date: undefined,
			ends_on_date: undefined,
			rate: undefined,
		},
		resolver: yupResolver(CreateJobValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job
	const onSubmit = async (values: createJobForm) => {
		//Check time valid
		if (new Date(values.starts_on_date) > new Date(values.ends_on_date)) {
			setToast({
				msg: 'Ends on time cannot be less than starts on time',
				type: 'warning',
			})
		} else {
			//Set value submit
			values.job_description = jobDescription
			values.status = values.status === 'Open' ? true : false

			//create new job
			await mutateCreJob(values)
		}
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

	//Set data option employees state
	useEffect(() => {
		if (allEmployees && allEmployees.employees) {
			const newOptionEmployees: IOption[] = []

			allEmployees.employees.map((employee) => {
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
	}, [allEmployees])

	//Set data option job type state
	useEffect(() => {
		if (allJobType && allJobType.jobTypes) {
			const newOptionJobTypes: IOption[] = []

			allJobType.jobTypes.map((jobType) => {
				newOptionJobTypes.push({
					label: (
						<>
							<Text>{jobType.name}</Text>
						</>
					),
					value: jobType.id,
				})
			})

			setOptionJobTypes(newOptionJobTypes)
		}
	}, [allJobType])

	//Set data option work experience state
	useEffect(() => {
		if (allWorkExperience && allWorkExperience.workExperiences) {
			const newOptionWorkExperiences: IOption[] = []

			allWorkExperience.workExperiences.map((workExperience) => {
				newOptionWorkExperiences.push({
					label: (
						<>
							<Text>{workExperience.name}</Text>
						</>
					),
					value: workExperience.id,
				})
			})

			setOptionWorkExperiences(newOptionWorkExperiences)
		}
	}, [allWorkExperience])

	//Set data option skills state
	useEffect(() => {
		if (allSkills && allSkills.skills) {
			const newOptionSkills: IOption[] = []

			allSkills.skills.map((skill) => {
				newOptionSkills.push({
					label: (
						<>
							<Text>{skill.name}</Text>
						</>
					),
					value: skill.id,
				})
			})

			setOptionSkills(newOptionSkills)
		}
	}, [allSkills])

	//Set data option locations state
	useEffect(() => {
		if (allLocations && allLocations.locations) {
			const newOptionLocations: IOption[] = []

			allLocations.locations.map((location) => {
				newOptionLocations.push({
					label: (
						<>
							<Text>{location.name}</Text>
						</>
					),
					value: location.id,
				})
			})

			setOptionLocations(newOptionLocations)
		}
	}, [allLocations])

	//Set data all department
	useEffect(() => {
		if (dataDepartments?.departments) {
			const newOptionDepartments: IOption[] = dataDepartments.departments.map(
				(department) => {
					return {
						value: department.id.toString(),
						label: department.name,
					}
				}
			)

			setOptionDepartments(newOptionDepartments)
		}
	}, [dataDepartments])

	//Show error
	useEffect(() => {
		if (errorDepartments) {
			setToast({
				type: 'error',
				msg: errorDepartments.response?.data.message,
			})
		}
	}, [errorDepartments])

	//Note when request success
	useEffect(() => {
		if (statusCreJob === 'success') {
			//Inform notice success
			if (dataCreJob) {
				setToast({
					type: statusCreJob,
					msg: dataCreJob?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			//Reset data form
			formSetting.reset({
				title: '',
				skills: [],
				locations: [],
				department: undefined,
				status: undefined,
				total_openings: 1,
				job_type: undefined,
				work_experience: undefined,
				recruiter: undefined,
				starting_salary_amount: 1,
				starts_on_date: undefined,
				ends_on_date: undefined,
			})

			setJobDescription('')
			refetchAllJobs()
		}
	}, [statusCreJob])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="title"
							label="Job Title"
							icon={
								<MdDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Job Title"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							form={formSetting}
							label={'Department'}
							name={'department'}
							required={true}
							options={optionDepartments}
							isModal={true}
							onOpenModal={onOpenDepartment}
							placeholder={'Select department'}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<SelectMany
								form={formSetting}
								label={'Select Skills'}
								name={'skills'}
								required={true}
								options={optionSkills}
								isModal={true}
								onOpenModal={onOpenSkill}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<SelectMany
								form={formSetting}
								label={'Select Locations'}
								name={'locations'}
								required={true}
								options={optionLocations}
								isModal={true}
								onOpenModal={onOpenLocation}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<InputNumber
							name="total_openings"
							label="Total Openings"
							form={formSetting}
							required
							min={1}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="starts_on_date"
							label="Starts On Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Starts on date"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="ends_on_date"
							label="Ends On Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Ends on date"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="status"
							label="status"
							required={true}
							form={formSetting}
							options={dataJobStatus}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="recruiter"
							label="Recruiter"
							required={false}
							form={formSetting}
							placeholder={'Select Recruiter'}
							options={optionEmployees}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<SelectCustom
								form={formSetting}
								label={'Select Job Type'}
								name={'job_type'}
								required={true}
								options={optionJobTypes}
								isModal={true}
								onOpenModal={onOpenJobType}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<SelectCustom
								form={formSetting}
								label={'Work Experience'}
								name={'work_experience'}
								required={true}
								options={optionWorkExperiences}
								isModal={true}
								onOpenModal={onOpenWorkExperience}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="rate"
							label="Rate"
							required={true}
							form={formSetting}
							options={dataJobRate}
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
								value={jobDescription}
								onChange={onChangeDescription}
							/>
						</VStack>
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
				{statusCreJob === 'running' && <Loading />}
			</Box>

			{/* Modal department and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenDepartment}
				onOpen={onOpenDepartment}
				onClose={onCloseDepartment}
				title="Department"
			>
				<Department />
			</Modal>

			{/* Modal skill */}
			<Modal
				size="3xl"
				isOpen={isOpenSkill}
				onOpen={onOpenSkill}
				onClose={onCloseSkill}
				title="Skill"
			>
				<AddSkillModal />
			</Modal>

			{/* Modal location */}
			<Modal
				size="3xl"
				isOpen={isOpenLocation}
				onOpen={onOpenLocation}
				onClose={onCloseLocation}
				title="Location"
			>
				<Locations />
			</Modal>

			{/* Modal jobType */}
			<Modal
				size="3xl"
				isOpen={isOpenJobType}
				onOpen={onOpenJobType}
				onClose={onCloseJobType}
				title="Job Type"
			>
				<JobTypes />
			</Modal>

			{/* Modal Work Experience */}
			<Modal
				size="3xl"
				isOpen={isOpenWorkExperience}
				onOpen={onOpenWorkExperience}
				onClose={onCloseWorkExperience}
				title="Work Experience"
			>
				<WorkExperiences />
			</Modal>
		</>
	)
}
