// components
import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Head, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { CSVLink } from 'react-csv'

// use layout
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'

// mutation
import {
	changeRoleMutation,
	deleteEmployeeMutation,
	deleteEmployeesMutation,
	importCSVEmployeesMutation,
} from 'mutations'
import { useRouter } from 'next/router'

// get all employees
import { allDepartmentsQuery, allDesignationsQuery, allEmployeesQuery } from 'queries'

import { useContext, useEffect, useState } from 'react'

// icons
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { BiExport } from 'react-icons/bi'
import { IoAdd } from 'react-icons/io5'

import { NextLayout } from 'type/element/layout'

// funcs, component to setup table
import { IFilter, TColumn } from 'type/tableTypes'
import { dataRoleEmployee } from 'utils/basicData'

// page add and update employee
import AddEmployees from './add-employees'
import UpdateEmployees from './update-employees'

import { Input, Select, SelectUser } from 'components/filter'
import ImportCSV from 'components/importCSV'
import { FaFileCsv } from 'react-icons/fa'
import { IOption } from 'type/basicTypes'
import { IPeople } from 'type/element/commom'
import { VscFilter } from 'react-icons/vsc'
import { employeeColumn } from 'utils/columns'

const Employees: NextLayout = () => {
	///setting for import csv--------------------------------------------------
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'name', key: 'name' },
		{ label: 'gender', key: 'gender' },
		{ label: 'email', key: 'email' },
		{ label: 'mobile', key: 'mobile' },
		{ label: 'address', key: 'address' },
		{ label: 'avatar', key: 'avatar' },
		{ label: 'can_login', key: 'can_login' },
		{ label: 'can_receive_email', key: 'can_receive_email' },
		{ label: 'date_of_birth', key: 'date_of_birth' },
		{ label: 'department', key: 'department' },
		{ label: 'designation', key: 'designation' },
		{ label: 'employeeId', key: 'employeeId' },
		{ label: 'hourly_rate', key: 'hourly_rate' },
		{ label: 'joining_date', key: 'joining_date' },
		{ label: 'role', key: 'role' },
		{ label: 'skills', key: 'skills' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	//Setup download csv template
	const headersCSVTemplate = [
		{ label: 'employeeId', key: 'employeeId' },
		{ label: 'name', key: 'name' },
		{ label: 'gender', key: 'gender' },
		{ label: 'email', key: 'email' },
		{ label: 'password', key: 'password' },
		{ label: 'mobile', key: 'mobile' },
		{ label: 'address', key: 'address' },
		{ label: 'date_of_birth', key: 'date_of_birth' },
		{ label: 'department', key: 'department' },
		{ label: 'designation', key: 'designation' },
		{ label: 'hourly_rate', key: 'hourly_rate' },
		{ label: 'joining_date', key: 'joining_date' },
	]

	const dataCSVTemplate = [
		{
			employeeId: 'epl-1',
			name: 'Nguyen Quang Huy',
			gender: 'Female',
			email: 'huy@gmail.com',
			password: 'password',
			mobile: 84888888888,
			address: 'HCM',
			date_of_birth: '1-1-2001',
			department: 1,
			designation: 1,
			hourly_rate: 1,
			joining_date: '1-1-2022',
		},
	]

	// set isOpen drawer to add, update
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//State download csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	const {
		isOpen: isOpenImportCSV,
		onOpen: onOpenImportCSV,
		onClose: onCloseImportCSV,
	} = useDisclosure()

	//State ---------------------------------------------------------------------

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	const [employeeId, setEmployeeId] = useState<number | null>(30)

	// all departments
	const [departments, setDepartments] = useState<IOption[]>()

	// all designations
	const [designations, setDesignations] = useState<IOption[]>()

	// data all users to select
	const [dataUsersSl, setAllUsersSl] = useState<IPeople[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// query and mutation -=------------------------------------------------------
	// get all employees
	const { data: allEmployees, mutate: refetchAllEmpl } = allEmployeesQuery(isAuthenticated)

	// get all department
	const { data: allDepartments } = allDepartmentsQuery(isAuthenticated)

	// get all Designations
	const { data: allDesignations } = allDesignationsQuery(isAuthenticated)

	//mutation --------------------------------------------------------------------
	const [mutateImportCSV, { status: statusImportCSV, data: dataImportCSV }] =
		importCSVEmployeesMutation(setToast)

	// delete employee
	const [mutateDeleteEmpl, { status: statusDl, data: dataDl }] = deleteEmployeeMutation(setToast)

	// delete all employees
	const [mutateDeleteEmpls, { status: statusDlMany, data: dataDlMany }] =
		deleteEmployeesMutation(setToast)

	// change role
	const [mutateChangeRole, { status: statusChangeRole, data: dataChangeRole }] =
		changeRoleMutation(setToast)

	//User effect ---------------------------------------------------------------
	// check authenticate in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDl,
			})
			refetchAllEmpl()
			setIsLoading(false)
		}
	}, [statusDl])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: statusDlMany,
			})
			setDataSl(null)
			refetchAllEmpl()
			setIsLoading(false)
		}
	}, [statusDlMany])

	// check is successfully when change role
	useEffect(() => {
		if (statusChangeRole == 'success' && dataChangeRole) {
			setToast({
				msg: dataChangeRole.message,
				type: statusChangeRole,
			})
			refetchAllEmpl()
		}
	}, [statusChangeRole])

	// check is successfully import csv
	useEffect(() => {
		if (statusImportCSV == 'success' && dataImportCSV?.message) {
			setToast({
				msg: dataImportCSV.message,
				type: statusImportCSV,
			})
			refetchAllEmpl()
			setIsLoading(false)
		}
	}, [statusImportCSV])

	// set loading == false when get all employees successfully
	useEffect(() => {
		if (allEmployees && allEmployees.employees) {
			const users = allEmployees.employees?.map((item): IPeople => {
				return {
					id: item.id,
					name: item.name,
					avatar: item.avatar?.url,
				}
			})
			setAllUsersSl(users || [])
			setIsLoading(false)

			//Set data csv
			const dataCSV: any[] = allEmployees.employees.map((employee) => ({
				id: employee.id,
				name: employee.name,
				gender: employee.gender,
				email: employee.email,
				mobile: employee.mobile,
				address: employee.address,
				avatar: employee.avatar?.id,
				can_login: employee.can_login ? 'true' : 'false',
				can_receive_email: employee.can_receive_email ? 'true' : 'false',
				date_of_birth: employee.date_of_birth,
				department: employee.department?.id,
				designation: employee.designation?.id,
				employeeId: employee.employeeId,
				hourly_rate: employee.hourly_rate,
				joining_date: employee.joining_date,
				role: employee.role,
				skills: employee.skills,
				createdAt: employee.createdAt,
				updatedAt: employee.updatedAt,
			}))

			setDataCSV(dataCSV)
		}
	}, [allEmployees])

	// set all departments
	useEffect(() => {
		if (allDepartments) {
			const data = allDepartments.departments?.map((item): IOption => {
				return {
					value: String(item.id),
					label: item.name,
				}
			})
			setDepartments(data)
		}
	}, [allDepartments])

	// set all designations
	useEffect(() => {
		if (allDesignations) {
			const data = allDesignations.designations?.map((item): IOption => {
				return {
					value: String(item.id),
					label: item.name,
				}
			})
			setDesignations(data)
		}
	}, [allDesignations])

	// function --------------------------------------
	const handleImportCSV = (data: any) => {
		mutateImportCSV({
			employees: data,
		})

		onCloseImportCSV()
	}

	// header ----------------------------------------
	const columns: TColumn[] = employeeColumn({
		currentUser,
		onDelete: (id: number) => {
			setEmployeeId(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setEmployeeId(id)
			onOpenUpdate()
		},
		dataRoleEmployee,
		onChangeRole: (id: number, event: any) => {
			setIsLoading(true)
			mutateChangeRole({
				employeeId: id,
				role: event.target.value,
			})
		},
	})

	return (
		<Box pb={8}>
			<Head title={'Employees'} />
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new employees by form'}
							title={'Add new'}
							action={onOpenAdd}
						/>
						<CSVLink filename={'employees.csv'} headers={headersCSV} data={dataCSV}>
							<Func
								icon={<BiExport />}
								description={'export to csv'}
								title={'export'}
								action={() => {}}
							/>
						</CSVLink>

						<CSVLink
							filename={'employeesTemplate.csv'}
							headers={headersCSVTemplate}
							data={dataCSVTemplate}
						>
							<Func
								icon={<FaFileCsv />}
								description={'export csv template'}
								title={'export csv template'}
								action={() => {}}
							/>
						</CSVLink>

						<ImportCSV
							fieldsValid={[
								'employeeId',
								'name',
								'gender',
								'email',
								'password',
								'mobile',
								'address',
								'date_of_birth',
								'department',
								'designation',
								'hourly_rate',
								'joining_date',
							]}
							handleImportCSV={handleImportCSV}
							statusImport={statusImportCSV === 'running'}
							isOpenImportCSV={isOpenImportCSV}
							onCloseImportCSV={onCloseImportCSV}
							onOpenImportCSV={onOpenImportCSV}
						/>
					</>
				)}
				<Func
					icon={<VscFilter />}
					description={'Open draw to filter'}
					title={'filter'}
					action={onOpenFilter}
				/>
				<Func
					icon={<AiOutlineDelete />}
					title={'Delete all'}
					description={'Delete all employees you selected'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
				/>
			</FuncCollapse>

			{currentUser && (
				<Table
					data={allEmployees?.employees || []}
					columns={columns}
					isLoading={isLoading}
					isSelect
					selectByColumn="id"
					setSelect={(data: Array<number>) => setDataSl(data)}
					disableRows={{
						column: 'email',
						values: [currentUser.email],
					}}
					filter={filter}
					disableColumns={['department', 'designation']}
					isResetFilter={isResetFilter}
				/>
			)}

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					mutateDeleteEmpl(String(employeeId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsLoading(true)
						mutateDeleteEmpls(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			{/* drawer to add employee */}
			<Drawer size="xl" title="Add Employee" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddEmployees onCloseDrawer={onCloseAdd} />
			</Drawer>

			{/* drawer to update employee */}
			<Drawer size="xl" title="Update Employee" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateEmployees onCloseDrawer={onCloseUpdate} employeeId={employeeId} />
			</Drawer>

			<Drawer
				size="xs"
				title="Filter"
				onClose={onCloseFilter}
				isOpen={isOpenFilter}
				footer={
					<Button
						onClick={() => {
							setIsReset(true)
							setTimeout(() => {
								setIsReset(false)
							}, 1000)
						}}
					>
						reset
					</Button>
				}
			>
				<VStack p={6} spacing={5}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'email'}
						label="Email"
						placeholder="Enter email"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<Select
						options={departments}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'department'}
						label="Department"
						placeholder="Select department"
					/>

					<Select
						options={designations}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'designation'}
						label="Designation"
						placeholder="Select designation"
					/>

					<Select
						options={dataRoleEmployee}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'role'}
						label="Role"
						placeholder="Select role"
					/>
					<SelectUser
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'id'}
						required={false}
						label={'Employee'}
						peoples={dataUsersSl}
					/>
				</VStack>
			</Drawer>
		</Box>
	)
}

Employees.getLayout = ClientLayout

export default Employees
