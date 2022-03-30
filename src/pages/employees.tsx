import {
	Button,
	Checkbox,
	Divider,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
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
import { AuthContext } from 'contexts/AuthContext'
import { createEmployeeMutation } from 'mutations/employee'
import { allDepartmentsQuery } from 'queries/department'
import { allDesignationsQuery } from 'queries/designation'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone, AiOutlineTeam } from 'react-icons/ai'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { MdDriveFileRenameOutline, MdPassword } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { createEmployeeForm } from 'type/form/auth'
import { CreateEmployeeValidate } from 'utils/validate'

export interface IEmployeesProps {}

export default function Employees(props: IEmployeesProps) {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { setToast } = useContext(AuthContext)
	const { isAuthenticated } = useContext(AuthContext)

	//State--------------------------------------------------------------------------------------------------
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])
	const [optionDesignations, setOptionDesignations] = useState<IOption[]>([])

	//Query -------------------------------------------------------------------------------------------------
	const { data: dataDepartments, error: errorDepartments } = allDepartmentsQuery(isAuthenticated)
	const { data: dataDesignations, error: errorDesignations } = allDesignationsQuery(isAuthenticated)

	//mutation ----------------------------------------------------------------------------------------------
	const [mutateCreateEmployee, {status: statusEmployee, data: dataEmployee}] = createEmployeeMutation(setToast)

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
			country: '',
			skills: [],
		},
		resolver: yupResolver(CreateEmployeeValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: createEmployeeForm) => mutateCreateEmployee(values)

	//function-------------------------------------------------------------------

	//User effect ---------------------------------------------------------------
	useEffect(() => {
		if (dataDepartments?.departments) {
			const newOptionDepartments: IOption[] = dataDepartments.departments.map(
				(department) => {
					return {
						value: department.id.toString(),
						lable: department.name,
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
						lable: designation.name,
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

	return (
		<div>
			<Button colorScheme="blue" onClick={onOpen}>
				open
			</Button>
			<Drawer size={'xl'} placement={'right'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">Add Employee</DrawerHeader>
					<DrawerBody>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Grid templateColumns="repeat(2, 1fr)" gap={6}>
								<GridItem w="100%">
									<Input
										name="employeeId"
										label="Employee ID"
										icon={
											<AiOutlineMail
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
										form={formSetting}
										placeholder="Enter employee Id"
										type="text"
										required
									/>
								</GridItem>
								<GridItem w="100%">
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
								<GridItem w="100%">
									<Input
										name="email"
										label="Email"
										icon={
											<AiOutlineMail
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
										form={formSetting}
										placeholder="Enter employee email"
										type="email"
										required
									/>
								</GridItem>
								<GridItem w="100%">
									<Input
										name="password"
										label="Password"
										icon={
											<MdPassword
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
										form={formSetting}
										placeholder="Enter employee password"
										type="password"
										required
									/>
								</GridItem>
								<GridItem w="100%">
									<Select
										name="designation"
										label="designation"
										required
										form={formSetting}
										placeholder={'Select designation'}
										options={optionDesignations}
									/>
								</GridItem>
								<GridItem w="100%">
									<Select
										name="department"
										label="Department"
										required
										form={formSetting}
										placeholder={'Select department'}
										options={optionDepartments}
									/>
								</GridItem>
								<GridItem w="100%">
									<Input
										name="joining_date"
										label="Joining Date"
										icon={
											<AiOutlineTeam
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
										form={formSetting}
										placeholder="Enter employee department"
										type="date"
										required
									/>
								</GridItem>
								<GridItem w="100%">
									<Input
										name="date_of_birth"
										label="Date Of Birth"
										icon={
											<AiOutlineTeam
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
										form={formSetting}
										placeholder="Select date of birth"
										type="date"
									/>
								</GridItem>
								<GridItem w="100%">
									<InputNumber
										name="hourly_rate"
										label="Hourly Rate ($)"
										form={formSetting}
										required
										min={1}
									/>
								</GridItem>
								<GridItem w="100%">
									<Input
										name="gender"
										label="Gender"
										icon={
											<BsGenderAmbiguous
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
										form={formSetting}
										placeholder="Enter gender"
										type="text"
										required
									/>
								</GridItem>

								<GridItem w="100%">
									<CoutrySelector name="country" form={formSetting} />
								</GridItem>

								<GridItem w="100%">
									<Input
										name="mobile"
										label="Mobile"
										icon={
											<AiOutlinePhone
												fontSize={'20px'}
												color="gray"
												opacity={0.6}
											/>
										}
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
								<GridItem w="100%">
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

								<GridItem w="100%">
									<VStack alignItems={'start'}>
										<Checkbox
											name="can_receive_email"
											colorScheme={'teal'}
											defaultChecked={formSetting.getValues(
												'can_receive_email'
											)}
											onChange={(e) =>
												formSetting.setValue(
													'can_receive_email',
													e.target.checked
												)
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
						</form>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</div>
	)
}
