import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { NextLayout } from 'type/element/layout'
import { ProjectLayout } from 'components/layouts'
import {
	allEmployeesInProjectQuery,
	employeesNotInProjectQuery,
	allDepartmentsQuery,
	detailProjectQuery,
} from 'queries'
import { TColumn } from 'type/tableTypes'
import {
	Avatar,
	HStack,
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
	updateHourlyRateMutation,
} from 'mutations'
import { AlertDialog, Func, FuncCollapse, Head, Table } from 'components/common'
import Modal from 'components/modal/Modal'
import { IOption } from 'type/basicTypes'
import {
	EmployeesByDepartmentProjectForm,
	EmployeesNotInProjectForm,
} from 'type/form/basicFormType'
import { useForm } from 'react-hook-form'
import { SelectMany } from 'components/form'
import { IoAdd } from 'react-icons/io5'
import { projectMembersColumn } from 'utils/columns'

import { projectMutationResponse } from 'type/mutationResponses'

var hourlyRateTimeOut: NodeJS.Timeout

const members: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast, socket } =
		useContext(AuthContext)
	const router = useRouter()

	const { projectId } = router.query
	const [employeeId, setIdEmployee] = useState<number>()
	const [projectResponse, setProject] = useState<projectMutationResponse>()

	// set option employee to select
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])

	// set option department to select
	const [optionDepartments, setOptionDepartments] = useState<IOption[]>([])

	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

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

	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId)

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

		await assignEmployee({
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

		await assignEmplByDepartment({
			inputUpdate: values,
			projectId,
		})
	}

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && projectId) {
			socket.emit('joinRoomMemberProject', projectId)

			socket.on('getNewMemberProject', () => {
				refetchMember()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && projectId) {
				socket.emit('leaveRoomMemberProject', projectId)
			}
		}

		return leaveRoom
	}, [socket, projectId])

	useEffect(() => {
		if (statusSetAdmin == 'success' && dataProjectAdmin) {
			setToast({
				type: statusSetAdmin,
				msg: dataProjectAdmin.message,
			})

			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newMemberProject', projectId)
			}

			refetchMember()
		}
	}, [statusSetAdmin])

	useEffect(() => {
		if (statusDelete == 'success' && dataDeleteEmpl) {
			setToast({
				type: statusDelete,
				msg: dataDeleteEmpl.message,
			})
			refetchMember()
			refetchEmplNotIn()
			setIsLoading(false)
			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newMemberProject', projectId)
			}
		}
	}, [statusDelete])

	useEffect(() => {
		if (statusHourlyRate == 'success' && dataHourlyRate) {
			setToast({
				type: statusHourlyRate,
				msg: dataHourlyRate.message,
			})
			refetchMember()
			setIsLoading(false)
			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newMemberProject', projectId)
			}
		}
	}, [statusHourlyRate])

	useEffect(() => {
		if (statusAssign == 'success' && dataAssign) {
			setToast({
				type: statusAssign,
				msg: dataAssign.message,
			})
			refetchMember()
			refetchEmplNotIn()
			setIsLoading(false)
			onCloseAdd()
			formSetting.reset({
				employees: [],
			})
			setRadioFormVl(1)
			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newMemberProject', projectId)
			}
		}
	}, [statusAssign])

	useEffect(() => {
		if (statusAssignByDepartment == 'success' && dataAssignByDepartment) {
			setToast({
				type: statusAssignByDepartment,
				msg: dataAssignByDepartment.message,
			})
			refetchMember()
			refetchEmplNotIn()
			setIsLoading(false)
			onCloseAdd()
			formSetting2.reset({
				departments: [],
			})
			setRadioFormVl(1)
			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newMemberProject', projectId)
			}
		}
	}, [statusAssignByDepartment])

	//Set data option employees state
	useEffect(() => {
		if (allEmployeesNotIn && allEmployeesNotIn.employees) {
			const newOptionEmployees: IOption[] = []

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
			const newOptionDepartments: IOption[] = []

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
			setIsLoading(false)
		}
	}, [projectResponse])

	// header ----------------------------------------
	const columns: TColumn[] = projectMembersColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdEmployee(id)
			onOpenDl()
		},
		setAdmin: (id: number) => {
			setProjectAdmin({
				idProject: projectId,
				idEmployee: id,
			})
		},
		project_Admin: projectResponse?.project?.project_Admin,
		setHourlyRate: (idMember: number, hourlyRate: number) => {
			clearTimeout(hourlyRateTimeOut)
			hourlyRateTimeOut = setTimeout(() => {
				setHourlyRate({
					hourly_rate: Number(hourlyRate),
					idEmployee: Number(idMember),
					idProject: projectResponse?.project?.id,
				})
				setIsLoading(true)
			}, 500)
		},
	})

	return (
		<Box pb={8}>
			<Head title={dataDetailProject?.project?.name} />
			{currentUser?.role == 'Admin' && (
				<FuncCollapse>
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new client by form'}
							title={'Add new'}
							action={onOpenAdd}
						/>
					</>
				</FuncCollapse>
			)}
			<Box overflow={'scroll'}>
				<Table
					data={projectResponse?.project?.employees || []}
					columns={columns}
					isLoading={isLoading}
					isSelect={false}
					disableColumns={
						currentUser?.role === 'Admin'
							? ['department', 'designation']
							: ['hourly_rate_project', 'department', 'designation', 'action']
					}
				/>
			</Box>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
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
				isOpen={isOpenAdd}
				onClose={onCloseAdd}
				onOpen={onOpenAdd}
				title={'Add project members'}
				size="lg"
				form="addEmployee"
				onOk={() => []}
			>
				<Box paddingInline={6}>
					<RadioGroup
						value={radioFormVl}
						onChange={(value: any) => {
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
										placeholder="Select employees"
										key={1}
										form={formSetting}
										label={'Employees'}
										name={'employees'}
										required={true}
										options={optionEmployees}
									/>
								) : (
									<SelectMany
										placeholder="Select departments"
										key={2}
										form={formSetting2}
										label={'Departments'}
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
		</Box>
	)
}

members.getLayout = ProjectLayout

export default members
