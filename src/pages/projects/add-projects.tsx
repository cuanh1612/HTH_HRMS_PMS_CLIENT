import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Divider,
	Grid,
	GridItem,
	HStack,
	Img,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'
import { InputNumber } from 'components/form/InputNumber'
import { Select } from 'components/form/Select'
import SelectCustom from 'components/form/SelectCustom'
import SelectMany from 'components/form/SelectMany'
import ItemFileUpload from 'components/ItemFileUpload'
import Loading from 'components/Loading'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { createProjectMutation } from 'mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { allClientsQuery } from 'queries/client'
import { allDepartmentsQuery } from 'queries/department'
import { allEmployeesQuery } from 'queries/employee'
import { allProjectsQuery } from 'queries/project'
import { allProjectCategoriesQuery } from 'queries/projectCategory'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { ICloudinaryImg } from 'type/fileType'
import { createProjectForm } from 'type/form/basicFormType'
import { dataCurrency } from 'utils/basicData'
import { generateImgFile } from 'utils/helper'
import { uploadFile } from 'utils/uploadFile'
import { createProjectValidate } from 'utils/validate'
import Department from '../departments'
import ProjectCategory from '../project-categories'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddProjectProps {
	onCloseDrawer: () => void
}

export default function AddProject({ onCloseDrawer }: IAddProjectProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
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

	const {
		isOpen: isOpenOtherDetails,
		onOpen: onOpenOtherDetails,
		onClose: onCloseOtherDetails,
	} = useDisclosure()

	//State ----------------------------------------------------------------------
	const [summary, setSummary] = useState<string>('')
	const [notes, setNotes] = useState<string>('')
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionClients, setOptionClients] = useState<IOption[]>([])
	const [optionProjectCategories, setOptionProjectCategories] = useState<IOption[]>([])
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])
	const [filesUpload, setFilesUpload] = useState<File[]>([])
	const [isLoadUpFiles, setIsLoadUpFiles] = useState<boolean>(false)
	const [isSendTaskNoti, setIsSendTaskNoti] = useState<boolean>(true)

	//query ----------------------------------------------------------------------
	// get all employees
	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)

	// get all clients
	const { data: allClients } = allClientsQuery(isAuthenticated)

	// get all project categories
	const { data: allProjectCategories } = allProjectCategoriesQuery(isAuthenticated)

	// get all department
	const { data: allDepartments } = allDepartmentsQuery(isAuthenticated)

	// refetch all Project
	const { mutate: refetchAllProjects } = allProjectsQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateCreProject, { status: statusCreProject, data: dataCreProject }] =
		createProjectMutation(setToast)

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
			let newOptionEmployees: IOption[] = []

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
		if (statusCreProject === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setFilesUpload([])

			setToast({
				type: 'success',
				msg: dataCreProject?.message as string,
			})
			refetchAllProjects()
		}
	}, [statusCreProject])

	// setForm and submit form create new project -------------------------------
	const formSetting = useForm<createProjectForm>({
		defaultValues: {
			name: '',
			start_date: undefined,
			deadline: undefined,
			project_category: undefined,
			department: undefined,
			client: undefined,
			employees: [],
			currency: undefined,
			project_budget: 0,
			hours_estimate: 0,
		},
		resolver: yupResolver(createProjectValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createProjectForm) => {
		//Check value employees
		if (!values.employees || values.employees.length === 0) {
			setToast({
				msg: 'Please selct employees for project',
				type: 'warning',
			})
		} else if (new Date(values.deadline) < new Date(values.start_date)) {
			setToast({
				msg: 'The deadline time must be greater than the project start date',
				type: 'warning',
			})
		} else {
			//Create project
			values.project_summary = summary
			values.notes = notes
			values.send_task_noti = isSendTaskNoti

			if (currentUser) {
				values.Added_by = currentUser.id
			}

			if (filesUpload.length > 0) {
				//Upload contract files
				const dataUploadFiles: ICloudinaryImg[] | null = await handleUploadFiles()

				//Check upload files project
				if (dataUploadFiles && dataUploadFiles?.length > 0) {
					//Create project
					values.project_files = dataUploadFiles
				}
			}

			mutateCreProject(values)
		}
	}

	//Funtion -------------------------------------------------------------------
	const onChangeSummary = (value: string) => {
		setSummary(value)
	}

	const onChangeNotes = (value: string) => {
		setNotes(value)
	}

	//Setting data file submit
	const onDrop = useCallback((acceptedFiles: File[]) => {
		//Check size
		let isValidSize = true
		acceptedFiles.forEach((file) => {
			if (file.size >= 10485760) {
				isValidSize = false
			}
		})

		if (isValidSize) {
			setFilesUpload(acceptedFiles)
		} else {
			setToast({
				msg: 'Each file should be less than 10MB in size.',
				type: 'warning',
			})
		}
	}, [])

	//Remove file upload
	const onRemoveFile = (index: number) => {
		const newFilesUpload = filesUpload.filter((_, indexFile) => indexFile !== index)
		setFilesUpload(newFilesUpload)
	}

	//Handle upload fies
	const handleUploadFiles = async () => {
		if (filesUpload.length > 0) {
			//Set is load upload file
			setIsLoadUpFiles(true)

			const dataUploadFiles: Array<ICloudinaryImg> = await uploadFile({
				files: filesUpload,
				tags: ['projectFile'],
				raw: true,
				upload_preset: 'project-file',
			})

			//Set is load upload file
			setIsLoadUpFiles(false)

			return dataUploadFiles
		}

		return null
	}

	//Handle trigger other detail
	const onTriggerOtherDetails = () => {
		if (isOpenOtherDetails) {
			setFilesUpload([])
			onCloseOtherDetails()
		} else {
			onOpenOtherDetails()
		}
	}

	//Setting files uploads -----------------------------------------------------
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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

					<GridItem w="100%" colSpan={[2]}>
						<SelectMany
							form={formSetting}
							label={'Select Employee'}
							name={'employees'}
							required={true}
							options={optionEmployees}
						/>
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
				<HStack onClick={onTriggerOtherDetails} cursor={'pointer'}>
					{isOpenOtherDetails ? <AiFillCaretUp /> : <AiFillCaretDown />}
					<Text fontSize={20} fontWeight={'semibold'}>
						Other Details
					</Text>
				</HStack>

				{isOpenOtherDetails && (
					<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
						<GridItem w="100%" colSpan={[2]}>
							<Text color={'gray.400'} fontWeight={'normal'}>
								Add Files
							</Text>
							<VStack w={'full'} spacing={5} position={'relative'} mt={2}>
								<VStack
									align={'center'}
									w={'full'}
									border={'4px dotted #009F9D30'}
									p={10}
									spacing={10}
									borderRadius={20}
									{...getRootProps()}
								>
									<Img
										width={150}
										height={100}
										alt="upload_file"
										src="/assets/uploadFiles.svg"
									/>
									<input {...getInputProps()} />
									{isDragActive ? (
										<Text fontSize={16} fontWeight={'semibold'} color={'gray'}>
											Drop the files here ...
										</Text>
									) : (
										<Text fontSize={16} fontWeight={'semibold'} color={'gray'}>
											Drag your documents, photos, or videos here to start
											uploading
										</Text>
									)}
								</VStack>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2]}>
							{filesUpload.length > 0 && (
								<VStack w={'full'} px={2}>
									{filesUpload.map((file, index) => (
										<ItemFileUpload
											key={index}
											src={generateImgFile(file.name)}
											fileName={file.name}
											index={index}
											onRemoveFile={onRemoveFile}
										/>
									))}
								</VStack>
							)}
						</GridItem>

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

				{(statusCreProject === 'running' || isLoadUpFiles) && <Loading />}
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
