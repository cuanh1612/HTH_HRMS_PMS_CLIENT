import {
	Box,
	Button,
	Checkbox,
	Divider,
	Grid,
	GridItem,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import CoutrySelector from 'components/form/CountrySelector'
import { Input } from 'components/form/Input'
import InputMutiple from 'components/form/InputMultiple'
import { InputNumber } from 'components/form/InputNumber'
import { Select } from 'components/form/Select'
import { Textarea } from 'components/form/Textarea'
import UploadAvatar from 'components/form/UploadAvatar'
import Loading from 'components/Loading'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { createEmployeeMutation } from 'mutations/employee'
import { useRouter } from 'next/router'
import { allDepartmentsQuery } from 'queries/department'
import { allDesignationsQuery } from 'queries/designation'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdDriveFileRenameOutline, MdPassword } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { createEmployeeForm } from 'type/form/basicFormType'
import { dataGender } from 'utils/basicData'
import { uploadFile } from 'utils/uploadFile'
import { CreateEmployeeValidate } from 'utils/validate'
import Department from '../departments'
import Designation from '../designations'
import {mutate} from 'swr'

export interface IEmployeesProps {
	onCloseDrawer?: () => void
}

export default function Employees({ onCloseDrawer }: IEmployeesProps) {
	// const { isOpen, onOpen, onClose } = useDisclosure()
	const { setToast, isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Setup modal -------------------------------------------------------------------------------------------
	const {
		isOpen: isOpenDepartment,
		onOpen: onOpenDepartment,
		onClose: onCloseDepartment,
	} = useDisclosure()

	const {
		isOpen: isOpenDesignation,
		onOpen: onOpenDesignation,
		onClose: onCloseDesignation,
	} = useDisclosure()

	//State--------------------------------------------------------------------------------------------------
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])
	const [optionDesignations, setOptionDesignations] = useState<IOption[]>([])
	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload

	//Query -------------------------------------------------------------------------------------------------
	const { data: dataDepartments, error: errorDepartments } = allDepartmentsQuery(isAuthenticated)
	const { data: dataDesignations, error: errorDesignations } =
		allDesignationsQuery(isAuthenticated)

	//mutation ----------------------------------------------------------------------------------------------
	const [mutateCreateEmployee, { status: statusEmployee, data: dataEmployee }] =
		createEmployeeMutation(setToast)

	// setForm and submit form create new employee ----------------------------------------------------------
	const formSetting = useForm<createEmployeeForm>({
		defaultValues: {
			employeeId: '',
			email: '',
			name: '',
			password: '',
			designation: '',
			department: '',
			hourly_rate: 1,
			can_login: true,
			can_receive_email: true,
			gender: '',
			mobile: '',
			country: '',
			address: '',
			skills: [],
		},
		resolver: yupResolver(CreateEmployeeValidate),
	})

	const { handleSubmit } = formSetting

	//function-------------------------------------------------------------------
	const handleUploadAvatar = async () => {
		if (infoImg) {
			setLoadingImg(true)

			const dataUploadAvatar: Array<ICloudinaryImg> = await uploadFile(
				infoImg.files,
				['avatar'],
				true,
				undefined,
				infoImg.options
			)

			setLoadingImg(false)
			
			return dataUploadAvatar[0]
		}

		return null
	}

	//Handle crete user
	const onSubmit = async (values: createEmployeeForm) => {
		//Upload avatar
		const dataUploadAvattar: ICloudinaryImg | null = await handleUploadAvatar()

		//Check upload avatar success
		if (dataUploadAvattar) {
			values.avatar = {
				name: dataUploadAvattar.name,
				url: dataUploadAvattar.url,
				public_id: dataUploadAvattar.public_id,
			}
		}

		//create new employee
		mutateCreateEmployee(values)
	}

	//User effect ---------------------------------------------------------------
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

	useEffect(() => {
		if (dataDesignations?.designations) {
			const newOptionDesignations: IOption[] = dataDesignations.designations.map(
				(designation) => {
					return {
						value: designation.id.toString(),
						label: designation.name,
					}
				}
			)

			setOptionDesignations(newOptionDesignations)
		}
	}, [dataDesignations])

	useEffect(() => {
		if (errorDepartments) {
			setToast({
				type: 'error',
				msg: errorDepartments.response?.data.message,
			})
		}

		if (errorDesignations) {
			setToast({
				type: 'error',
				msg: errorDesignations.response?.data.message,
			})
		}
	}, [errorDepartments, errorDesignations])

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

	//Note when request success
	useEffect(() => {
		if (statusEmployee === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			// refetch all employees
			mutate('employees')
			setToast({
				type: 'success',
				msg: dataEmployee?.message as string,
			})

			formSetting.reset({
				employeeId: '',
				email: '',
				name: '',
				password: '',
				designation: '',
				department: '',
				hourly_rate: 1,
				can_login: true,
				can_receive_email: true,
				gender: '',
				country: '',
				mobile: '',
				address: '',
				skills: [],
				joining_date: '',
				date_of_birth: '',
			})
		}
	}, [statusEmployee])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={2}>
						<UploadAvatar
							setInfoImg={(data?: IImg) => {
								setInfoImg(data)
							}}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="employeeId"
							label="Employee ID"
							icon={<AiOutlineMail fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter employee Id"
							type="text"
							required
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="name"
							label="Name"
							icon={
								<MdDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Enter employee name"
							type="text"
							required
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="email"
							label="Email"
							icon={<AiOutlineMail fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter employee email"
							type="email"
							required
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="password"
							label="Password"
							icon={<MdPassword fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter employee password"
							type="password"
							required
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="designation"
							label="designation"
							required
							form={formSetting}
							placeholder={'Select designation'}
							options={optionDesignations}
							isModal={true}
							onOpenModal={onOpenDesignation}
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="department"
							label="Department"
							required
							form={formSetting}
							placeholder={'Select department'}
							options={optionDepartments}
							isModal={true}
							onOpenModal={onOpenDepartment}
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="joining_date"
							label="Joining Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Select Joining Date"
							type="date"
							required
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="date_of_birth"
							label="Date Of Birth"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Select date of birth"
							type="date"
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<InputNumber
							name="hourly_rate"
							label="Hourly Rate ($)"
							form={formSetting}
							required
							min={1}
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="gender"
							label="Gender"
							required
							form={formSetting}
							placeholder={'Select Gender'}
							options={dataGender}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<CoutrySelector name="country" form={formSetting} />
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="mobile"
							label="Mobile"
							icon={<AiOutlinePhone fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter mobile"
							type="tel"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<Textarea
							name="address"
							label="Address"
							placeholder="Enter address"
							form={formSetting}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<InputMutiple lable="Skills" name="skills" form={formSetting} />
					</GridItem>
				</Grid>

				<Divider marginY={6} />

				<Text fontSize={20} fontWeight={'semibold'}>
					Advanced Info
				</Text>

				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack alignItems={'start'}>
							<Checkbox
								colorScheme={'teal'}
								name="can_login"
								defaultChecked={formSetting.getValues('can_login')}
								onChange={(e) =>
									formSetting.setValue('can_login', e.target.checked)
								}
							>
								Can login to app
							</Checkbox>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack alignItems={'start'}>
							<Checkbox
								name="can_receive_email"
								colorScheme={'teal'}
								defaultChecked={formSetting.getValues('can_receive_email')}
								onChange={(e) =>
									formSetting.setValue('can_receive_email', e.target.checked)
								}
							>
								Can receive email notifications
							</Checkbox>
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
				{(statusEmployee == 'running' || loadingImg) && <Loading />}
			</Box>

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

			<Modal
				size="3xl"
				isOpen={isOpenDesignation}
				onOpen={onOpenDesignation}
				onClose={onCloseDesignation}
				title="Designation"
			>
				<Text>
					<Designation />
				</Text>
			</Modal>
		</>
	)
}
