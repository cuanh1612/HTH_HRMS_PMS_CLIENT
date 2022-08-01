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
import { updateJobMutation } from 'mutations/job'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { allDepartmentsQuery, allEmployeesQuery } from 'queries'
import { allJobsQuery, detailJobQuery } from 'queries/job'
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
import Department from 'src/pages/departments'
import JobTypes from 'src/pages/jobTypes'
import Locations from 'src/pages/locations'
import AddSkillModal from 'src/pages/skills/add-skills-modal'
import WorkExperiences from 'src/pages/workExperiences'
import { IOption } from 'type/basicTypes'
import { updateJobForm } from 'type/form/basicFormType'
import { dataJobRate, dataJobStatus } from 'utils/basicData'
import { UpdateJobValidate } from 'utils/validate'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IUpdateJobProps {
	onCloseDrawer?: () => void
	JobIdProp: number | null
}

export default function UpdateJob({ onCloseDrawer, JobIdProp }: IUpdateJobProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query

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

	//State ----------------------------------------------------------------------
	// all departments
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])
	const [optionSkills, setOptionSkills] = useState<IOption[]>([])
	const [optionJobTypes, setOptionJobTypes] = useState<IOption[]>([])
	const [optionWorkExperiences, setOptionWorkExperiences] = useState<IOption[]>([])
	const [optionLocations, setOptionLocations] = useState<IOption[]>([])
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [jobDescription, setJobDescription] = useState<string>('')

	//State selected
	const [selectedOptionSkills, setSelectedSkills] = useState<IOption[]>([])
	const [selectedOptionLocations, setSelectedLocations] = useState<IOption[]>([])
	const [selectedOptionDepartment, setSelectedDepartment] = useState<IOption>()

	//query ----------------------------------------------------------------------
	// get detail job Id
	const { data: dataDetailJob } = detailJobQuery(JobIdProp || (jobIdRouter as string))

	// refetch all jobs
	const { mutate: refetchJobs } = allJobsQuery()

	// get all department
	const { data: dataDepartments, error: errorDepartments } = allDepartmentsQuery(isAuthenticated)
	// get all skills
	const { data: allSkills } = allSkillsQuery(isAuthenticated)
	// get all locations
	const { data: allLocations } = allLocationsQuery(isAuthenticated)
	// get all employees
	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)
	// get all job type
	const { data: allJobType } = allJobTypesQuery(isAuthenticated)
	// get all work experience
	const { data: allWorkExperience } = allWorkExperiencesQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateUpJob, { status: statusUpJob, data: dataUpJob }] = updateJobMutation(setToast)

	// setForm and submit form create new job ---------------------------------
	const formSetting = useForm<updateJobForm>({
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
		resolver: yupResolver(UpdateJobValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job
	const onSubmit = async (values: updateJobForm) => {
		if (!jobIdRouter && !JobIdProp) {
			setToast({
				msg: 'Not found job to update',
				type: 'error',
			})
		} else {
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

				console.log(values)

				//create new job
				await mutateUpJob({
					...values,
					jobId: JobIdProp || (jobIdRouter as string),
				})
			}
		}
	}

	//Function -------------------------------------------------------------------
	const onChangeDescription = (value: string) => {
		setJobDescription(value)
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
		if (statusUpJob === 'success') {
			//Inform notice success
			if (dataUpJob) {
				setToast({
					type: statusUpJob,
					msg: dataUpJob?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			refetchJobs()
		}
	}, [statusUpJob])

	//Change data form when have data detail event
	useEffect(() => {
		if (dataDetailJob && dataDetailJob.job) {
			//Set data selected option skills
			if (dataDetailJob.job.skills) {
				const newSelectedOptionSkills: IOption[] = []

				dataDetailJob.job.skills.map((skill) => {
					newSelectedOptionSkills.push({
						label: (
							<>
								<Text>{skill.name}</Text>
							</>
						),
						value: skill.id,
					})
				})

				setSelectedSkills(newSelectedOptionSkills)
			}

			//Set data selected option locations
			if (dataDetailJob.job.locations) {
				const newSelectedOptionLocations: IOption[] = []

				dataDetailJob.job.locations.map((location) => {
					newSelectedOptionLocations.push({
						label: (
							<>
								<Text>{location.name}</Text>
							</>
						),
						value: location.id,
					})
				})

				setSelectedLocations(newSelectedOptionLocations)
			}

			//Set data selected option department
			if (dataDetailJob.job.department) {
				const newSelectedDepartment: IOption = {
					label: (
						<>
							<Text>{dataDetailJob.job.department.name}</Text>
						</>
					),
					value: dataDetailJob.job.department.id,
				}
				setSelectedDepartment(newSelectedDepartment)
			}

			//Set date description
			setJobDescription(dataDetailJob.job.job_description || '')

			//set data form
			formSetting.reset({
				title: dataDetailJob.job.title || '',
				skills: dataDetailJob.job.skills
					? dataDetailJob.job.skills.map((skill) => skill.id)
					: undefined,
				locations: dataDetailJob.job.locations
					? dataDetailJob.job.locations.map((location) => location.id)
					: undefined,
				department: dataDetailJob.job.department
					? dataDetailJob.job.department.id
					: undefined,
				status: dataDetailJob.job.status ? 'Open' : 'Close',
				total_openings: dataDetailJob.job.total_openings || 1,
				job_type: dataDetailJob.job.job_type ? dataDetailJob.job.job_type.id : undefined,
				work_experience: dataDetailJob.job.work_experience
					? dataDetailJob.job.work_experience.id
					: undefined,
				recruiter: dataDetailJob.job.recruiter ? dataDetailJob.job.recruiter.id : undefined,
				starting_salary_amount: dataDetailJob.job.starting_salary_amount || 1,
				starts_on_date: dataDetailJob.job.starts_on_date || undefined,
				ends_on_date: dataDetailJob.job.ends_on_date || undefined,
				rate: dataDetailJob.job.rate || undefined,
				job_description: dataDetailJob.job.job_description || '',
			})
		}
	}, [dataDetailJob])

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
							selectedOption={selectedOptionDepartment}
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
								selectedOptions={selectedOptionSkills}
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
								selectedOptions={selectedOptionLocations}
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
				{statusUpJob === 'running' && <Loading />}
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
