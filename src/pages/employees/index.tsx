// components
import {
	Avatar,
	Badge,
	Box,
	Collapse,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select as CSelect,
	Text,
	Button,
	useDisclosure,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	Drawer as CDrawer,
	DrawerBody,
	DrawerCloseButton,
	VStack,
} from '@chakra-ui/react'
import AlertDialog from 'components/AlertDialog'
import Drawer from 'components/Drawer'

// use layout
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'

// mutation
import {
	changeRoleMutation,
	deleteEmployeeMutation,
	deleteEmployeesMutation,
} from 'mutations/employee'
import { useRouter } from 'next/router'

// get all employees
import { allEmployeesQuery } from 'queries/employee'

import { useContext, useEffect, useState } from 'react'

// icons
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineSearch } from 'react-icons/ai'
import { BiExport, BiImport } from 'react-icons/bi'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'

import { NextLayout } from 'type/element/layout'

// fucs, component to setup table
import Table from 'components/Table'
import { IFilter, TColumn } from 'type/tableTypes'
import { dataRoleEmployee } from 'utils/basicData'

// filter of column
import { selectFilter, textFilter } from 'utils/filters'

// page add and update employee
import AddEmployees from './add-employees'
import UpdateEmployees from './update-employees'

import { allDepartmentsQuery } from 'queries/department'
import { IOption } from 'type/basicTypes'
import { allDesignationsQuery } from 'queries/designation'
import { Select } from 'components/filter/Select'
import { Input } from 'components/filter/Input'
import { IPeople } from 'type/element/commom'
import SelectUser from 'components/filter/SelectUser'

const Employees: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// set isOpen drawer to add, update
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	//set isopen of function
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: true,
	})

	//State ---------------------------------------------------------------------
	// get id to delete employee
	const [idDeleteEmpl, setIdDeleteEmpl] = useState<number>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	const [employeeIdUpdate, setEmployeeUpdate] = useState<number | null>(30)

	// all departments
	const [departments, setDepartments] = useState<IOption[]>()

	// all departments
	const [designations, setDesignations] = useState<IOption[]>()

	// data all users to select
	const [dataUsersSl, setAllusersSl] = useState<IPeople[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// query and mutation -=------------------------------------------------------
	// get all employees
	const { data: allEmployees, mutate: refetchAllEmpl } = allEmployeesQuery(isAuthenticated)

	// get all department
	const { data: allDepartments, mutate: refetchAllDepartments } =
		allDepartmentsQuery(isAuthenticated)

	// get all Designations
	const { data: allDesignations, mutate: refetchDesignations } =
		allDesignationsQuery(isAuthenticated)
		
	console.log(refetchAllDepartments, refetchDesignations)

	// delete employee
	const [mutateDeleteEmpl, { status: statusDl }] = deleteEmployeeMutation(setToast)

	// delete all employees
	const [mutateDeleteEmpls, { status: statusDlMany }] = deleteEmployeesMutation(setToast)

	// change role
	const [mutateChangeRole, { status: statusChangeRole }] = changeRoleMutation(setToast)

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
		if (statusDl == 'success') {
			setToast({
				msg: 'Delete employee successfully',
				type: 'success',
			})
			refetchAllEmpl()
		}
	}, [statusDl])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success') {
			setToast({
				msg: 'Delete employees successfully',
				type: 'success',
			})
			setDataSl(null)
			refetchAllEmpl()
		}
	}, [statusDlMany])

	// check is successfully when change role
	useEffect(() => {
		if (statusChangeRole == 'success') {
			setToast({
				msg: 'Change role success',
				type: 'success',
			})
			refetchAllEmpl()
		}
	}, [statusChangeRole])

	// set loading == false when get all employees successfully
	useEffect(() => {
		if (allEmployees) {
			const users = allEmployees.employees?.map((item): IPeople => {
				return {
					id: item.id,
					name: item.name,
					avatar: item.avatar?.url,
				}
			})
			setAllusersSl(users || [])
			setIsloading(false)
		}
	}, [allEmployees])

	// set all departments
	useEffect(() => {
		if (allDepartments) {
			const data = allDepartments.departments?.map((item): IOption => {
				return {
					value: String(item.id),
					lable: item.name,
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
					lable: item.name,
				}
			})
			setDesignations(data)
		}
	}, [allDesignations])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Employees',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					filter: selectFilter(['id']),
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
										{currentUser?.email == row.values['email'] && (
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
					Header: 'Email',
					accessor: 'email',
					minWidth: 150,
					filter: textFilter(['email']),
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'User role',
					accessor: 'role',
					minWidth: 160,
					filter: selectFilter(['role']),
					Cell: ({ value, row }) => {
						if (row.values['email'] == currentUser?.email)
							return (
								<CSelect
									defaultValue={value}
									onChange={(event) => {
										setIsloading(true)
										mutateChangeRole({
											employeeId: Number(row.values['id']),
											role: event.target.value,
										})
									}}
								>
									<option value={'Admin'}>Admin</option>
								</CSelect>
							)
						return (
							<CSelect
								defaultValue={value}
								onChange={(event) => {
									setIsloading(true)
									mutateChangeRole({
										employeeId: Number(row.values['id']),
										role: event.target.value,
									})
								}}
							>
								{dataRoleEmployee.map((item) => (
									<option value={item.value} key={item.value}>
										{item.lable}
									</option>
								))}
							</CSelect>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					minWidth: 150,
					Cell: () => {
						return (
							<HStack alignItems={'center'}>
								<Box
									background={'hu-Green.normal'}
									w={'3'}
									borderRadius={'full'}
									h={'3'}
								/>
								<Text>Active</Text>
							</HStack>
						)
					},
				},
				{
					Header: 'Department',
					accessor: 'department',
					filter: selectFilter(['department', 'id']),
					Cell: () => '',
				},
				{
					Header: 'Designation',
					accessor: 'designation',
					filter: selectFilter(['designation', 'id']),
					Cell: () => '',
				},
				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => (
						<Menu>
							<MenuButton as={Button} paddingInline={3}>
								<MdOutlineMoreVert />
							</MenuButton>
							<MenuList>
								<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>View</MenuItem>
								<MenuItem
									onClick={() => {
										setEmployeeUpdate(row.values['id'])
										onOpenUpdate()
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>
								{currentUser?.email != row.values['email'] && (
									<MenuItem
										onClick={() => {
											setIdDeleteEmpl(row.values['id'])
											onOpenDl()
										}}
										icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
									>
										Delete
									</MenuItem>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	return (
		<Box>
			<HStack
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggle}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
			>
				<Text fontWeight={'semibold'}>Function</Text>
				{isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse in={isOpen} animateOpacity>
				<HStack marginTop={'2'} paddingBlock={'5'} spacing={'5'}>
					<Button
						onClick={onOpenAdd}
						transform={'auto'}
						bg={'hu-Green.lightA'}
						_hover={{
							bg: 'hu-Green.normal',
							color: 'white',
							scale: 1.05,
						}}
						color={'hu-Green.normal'}
						leftIcon={<IoAdd />}
					>
						Add employees
					</Button>
					<Button
						transform={'auto'}
						_hover={{
							bg: 'hu-Pink.normal',
							color: 'white',
							scale: 1.05,
						}}
						leftIcon={<IoAdd />}
						borderColor={'hu-Pink.normal'}
						color={'hu-Pink.dark'}
						variant={'outline'}
					>
						Invite Employee
					</Button>
					<Button
						transform={'auto'}
						_hover={{
							bg: 'hu-Pink.normal',
							color: 'white',
							scale: 1.05,
						}}
						leftIcon={<BiImport />}
						borderColor={'hu-Pink.normal'}
						color={'hu-Pink.dark'}
						variant={'outline'}
					>
						Import
					</Button>
					<Button
						transform={'auto'}
						_hover={{
							bg: 'hu-Pink.normal',
							color: 'white',
							scale: 1.05,
						}}
						leftIcon={<BiExport />}
						borderColor={'hu-Pink.normal'}
						color={'hu-Pink.dark'}
						variant={'outline'}
					>
						Export
					</Button>
					<Button
						disabled={!dataSl || dataSl.length == 0 ? true : false}
						onClick={onOpenDlMany}
					>
						Delete all
					</Button>
					<Button onClick={onOpenFilter}>open filter</Button>
					<Button
						onClick={() => {
							setIsReset(true)
							setTimeout(() => {
								setIsReset(false)
							}, 1000)
						}}
					>
						reset filter
					</Button>
				</HStack>
			</Collapse>
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
					setIsloading(true)
					mutateDeleteEmpl(String(idDeleteEmpl))
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
						setIsloading(true)
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
				<UpdateEmployees onCloseDrawer={onCloseUpdate} employeeId={employeeIdUpdate} />
			</Drawer>

			<CDrawer isOpen={isOpenFilter} placement="right" onClose={onCloseFilter}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Filters</DrawerHeader>

					<DrawerBody>
						<VStack spacing={5}>
							<Input
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'email'}
								label="Email"
								placeholder="Enter email"
								required={false}
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
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
								required={false}
							/>

							<Select
								options={designations}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'designation'}
								label="Designation"
								placeholder="Select designation"
								required={false}
							/>

							<Select
								options={dataRoleEmployee}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'role'}
								label="Role"
								placeholder="Select role"
								required={false}
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
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

Employees.getLayout = ClientLayout

export default Employees
