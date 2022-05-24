import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { NextLayout } from 'type/element/layout'
import { ClientLayout } from 'components/layouts'
import { allEmployeesInProjectQuery, employeesNotInProjectQuery, allDepartmentsQuery} from 'queries'
import { TColumn } from 'type/tableTypes'
import {
	Avatar,
	Badge,
	Button,
	HStack,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Radio,
	Text,
	useDisclosure,
	VStack,
	RadioGroup,
	Box,
} from '@chakra-ui/react'
import {
	assignEmplByDepartmentMutation,
	assignEmployeeMutation,
	deleteEmpInProjectMutation,
	projectAdminMutation,
	updateHourlyRateMutation
} from 'mutations'
import {AlertDialog, Table} from 'components/common'
import { projectMutaionResponse } from 'type/mutationResponses'
import Modal from 'components/modal/Modal'
import { IOption } from 'type/basicTypes'
import {
	EmployeesByDepartmentProjectForm,
	EmployeesNotInProjectForm,
} from 'type/form/basicFormType'
import { useForm } from 'react-hook-form'
import { SelectMany} from 'components/form'

var hourlyRateTimeOut: NodeJS.Timeout

const members: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query
	const [employeeId, setIdEmployee] = useState<number>()
	const [projectResponse, setProject] = useState<projectMutaionResponse>()

	// set option employee to select
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])

	// set option department to select
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])

	const { isOpen, onOpen, onClose } = useDisclosure()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// set radio to add employee by id or department
	const [radioFormVl, setRadioFormVl] = useState(1)

	// set project admin
	const [setProjectAdmin, { status: statusSetAdmin, data: dataProjectAdmin }] =
		projectAdminMutation(setToast)

	// delete employee in project
	const [deleteEmployee, { status: statusDelete, data: dataDeleteEmpl }] =
		deleteEmpInProjectMutation(setToast)

	// assign employees to project
	const [assignEmployee, { status: statusAssign, data: dataAssign }] =
		assignEmployeeMutation(setToast)

	// assign employees to project by department
	const [
		assignEmplByDepartment,
		{ status: statusAssignByDepartment, data: dataAssignByDepartment },
	] = assignEmplByDepartmentMutation(setToast)

	// set hourly rate
	const [setHourlyRate, { status: statusHourlyRate, data: dataHourlyRate }] =
		updateHourlyRateMutation(setToast)

	// get all employee in project
	const { data: allEmployees, mutate: refetchMember } = allEmployeesInProjectQuery(
		isAuthenticated,
		projectId
	)

	// get all employee not in project
	const { data: allEmployeesNotIn, mutate: refetchEmplNotIn } = employeesNotInProjectQuery(
		isAuthenticated,
		projectId
	)

	// get all department
	const { data: allDepartments } = allDepartmentsQuery(isAuthenticated)

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// setForm and submit form to add employees not in project
	const formSetting = useForm<EmployeesNotInProjectForm>({
		defaultValues: {
			employees: [],
		},
	})
	const { handleSubmit } = formSetting
	const onSubmit = async (values: EmployeesNotInProjectForm) => {
		if (values.employees.length == 0) {
			return setToast({
				msg: 'Please, select at least 1 employee',
				type: 'error',
			})
		}

		assignEmployee({
			inputUpdate: values,
			projectId,
		})
	}

	// setForm and submit form to add employee by departments
	const formSetting2 = useForm<EmployeesByDepartmentProjectForm>({
		defaultValues: {
			departments: [],
		},
	})
	const { handleSubmit: handleSubmit2 } = formSetting2
	const onSubmit2 = async (values: EmployeesByDepartmentProjectForm) => {
		if (values.departments.length == 0) {
			return setToast({
				msg: 'Please, select at least 1 department',
				type: 'error',
			})
		}

		assignEmplByDepartment({
			inputUpdate: values,
			projectId,
		})
	}

	useEffect(() => {
		if (statusSetAdmin == 'success' && dataProjectAdmin) {
			setToast({
				type: 'success',
				msg: dataProjectAdmin.message,
			})

			refetchMember()
		}
	}, [statusSetAdmin])

	useEffect(() => {
		if (statusDelete == 'success' && dataDeleteEmpl) {
			setToast({
				type: 'success',
				msg: dataDeleteEmpl.message,
			})
			refetchMember()
			refetchEmplNotIn()
			setIsloading(false)
		}
	}, [statusDelete])

	useEffect(() => {
		if (statusHourlyRate == 'success' && dataHourlyRate) {
			setToast({
				type: 'success',
				msg: dataHourlyRate.message,
			})
			refetchMember()
			setIsloading(false)
		}
	}, [statusHourlyRate])

	useEffect(() => {
		if (statusAssign == 'success' && dataAssign) {
			setToast({
				type: 'success',
				msg: dataAssign.message,
			})
			refetchMember()
			refetchEmplNotIn()
			setIsloading(false)
			onClose()
			formSetting.reset({
				employees: [],
			})
			setRadioFormVl(1)
		}
	}, [statusAssign])

	useEffect(() => {
		if (statusAssignByDepartment == 'success' && dataAssignByDepartment) {
			setToast({
				type: 'success',
				msg: dataAssignByDepartment.message,
			})
			refetchMember()
			refetchEmplNotIn()
			setIsloading(false)
			onClose()
			formSetting2.reset({
				departments: [],
			})
			setRadioFormVl(1)
		}
	}, [statusAssignByDepartment])

	//Set data option employees state
	useEffect(() => {
		if (allEmployeesNotIn && allEmployeesNotIn.employees) {
			let newOptionEmployees: IOption[] = []

			allEmployeesNotIn.employees.map((employee) => {
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
	}, [allEmployeesNotIn])

	//Set data option employees state
	useEffect(() => {
		if (allDepartments && allDepartments.departments) {
			let newOptionDepartments: IOption[] = []

			allDepartments.departments.map((department) => {
				newOptionDepartments.push({
					label: department.name,
					value: department.id,
				})
			})

			setOptionDepartments(newOptionDepartments)
		}
	}, [allDepartments])

	// check login
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (allEmployees?.project) {
			allEmployees.project.employees = allEmployees.project?.employees?.map(
				(employee, key) => {
					return {
						...employee,
						hourly_rate_project: allEmployees.hourly_rate_projects[key],
					}
				}
			)
			setProject(allEmployees)
		}
	}, [allEmployees])

	useEffect(() => {
		if (projectResponse) {
			setIsloading(false)
		}
	}, [projectResponse])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Project member',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
					Cell: ({ value }) => {
						return value
					},
				},
				{
					Header: 'Employee Id',
					accessor: 'employeeId',
					minWidth: 180,
					width: 180,
					disableResizing: true,
				},
				{
					Header: 'Name',
					accessor: 'name',
					minWidth: 250,
					Cell: ({ value, row }) => {
						return (
							<HStack w={'full'} spacing={5}>
								<Avatar
									flex={'none'}
									size={'sm'}
									name={row.values['name']}
									src={row.original.avatar?.url}
								/>
								<VStack w={'70%'} alignItems={'start'}>
									<Text isTruncated w={'full'}>
										{value}
										{currentUser?.id == row.values['id'] && (
											<Badge
												marginLeft={'5'}
												color={'white'}
												background={'gray.500'}
											>
												It's you
											</Badge>
										)}
									</Text>
									<Text isTruncated w={'full'} fontSize={'sm'} color={'gray.400'}>
										Junior
									</Text>
								</VStack>
							</HStack>
						)
					},
				},
				{
					Header: 'hourly rate',
					accessor: 'hourly_rate_project',
					minWidth: 180,
					width: 180,
					Cell: ({ value, row }) => (
						<NumberInput
							min={1}
							precision={2}
							onChange={(value) => {
								clearTimeout(hourlyRateTimeOut)
								hourlyRateTimeOut = setTimeout(() => {
									setHourlyRate({
										hourly_rate: Number(value),
										idEmployee: Number(row.values['id']),
										idProject: projectResponse?.project?.id,
									})
									setIsloading(true)
								}, 500)
							}}
							defaultValue={Number(value.hourly_rate)}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					),
				},
				{
					Header: 'User role',
					accessor: 'role',
					minWidth: 180,
					width: 180,
					Cell: ({ row }) => {
						return (
							<HStack spacing={4}>
								<Radio
									onChange={(event) => {
										setProjectAdmin({
											idProject: projectId,
											idEmployee: row.values['id'],
										})
									}}
									isChecked={
										projectResponse?.project?.project_Admin
											? projectResponse.project.project_Admin.id ==
											  row.values['id']
											: false
									}
									value={row.values['id']}
								/>
								<Text>Project Admin</Text>
							</HStack>
						)
					},
				},
				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => (
						<Button
							onClick={() => {
								setIdEmployee(Number(row.values['id']))
								onOpenDl()
							}}
						>
							Delete
						</Button>
					),
				},
			],
		},
	]

	return (
		<div>
			<Button onClick={onOpen}>Add new</Button>

			<Table
				data={projectResponse?.project?.employees || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={false}
				disableColumns={['department', 'designation']}
			/>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteEmployee({
						employeeId,
						projectId,
					})
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				onOpen={onOpen}
				title={'Add project members'}
				size="lg"
				form="addEmployee"
				onOk={() => []}
			>
				<Box paddingInline={6}>
					<RadioGroup
						value={radioFormVl}
						onChange={(value) => {
							setRadioFormVl(Number(value))
						}}
					>
						<VStack spacing={5} alignItems={'start'}>
							<HStack spacing={5}>
								<Radio value={1}>Choose Members</Radio>
								<Radio value={2}>Chose Department</Radio>
							</HStack>
							<Box
								w={'full'}
								as="form"
								id="addEmployee"
								onSubmit={
									radioFormVl == 1
										? handleSubmit(onSubmit)
										: handleSubmit2(onSubmit2)
								}
							>
								{radioFormVl == 1 ? (
									<SelectMany
										key={1}
										form={formSetting}
										label={'Select Employee'}
										name={'employees'}
										required={true}
										options={optionEmployees}
									/>
								) : (
									<SelectMany
										key={2}
										form={formSetting2}
										label={'Select department'}
										name={'departments'}
										required={true}
										options={optionDepartments}
									/>
								)}
							</Box>
						</VStack>
					</RadioGroup>
				</Box>
			</Modal>
		</div>
	)
}

members.getLayout = ClientLayout

export default members
