
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
	Select,
	Text,
	Button,
	useDisclosure
} from '@chakra-ui/react'
import AlertDialog from 'components/AlertDialog'
import Drawer from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import Table from 'components/Table'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allEmployeesQuery } from 'queries/employee'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'
import { BiExport, BiImport } from 'react-icons/bi'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { TColumn } from 'type/tableTypes'
import { dataRoleEmployee } from 'utils/basicData'
import { arrayFilter, textFilter } from 'utils/filters'
import AddEmployees from './add-employees'
import UpdateEmployees from './update-employees'

export interface IEmployeesProps {}

const Employees: NextLayout = (props: IEmployeesProps) => {
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<string>>()

	// set isOpen of dialog
	const { isOpen: isOpenDialog, onOpen, onClose } = useDisclosure()

	useEffect(() => {
		console.log(isOpenDialog)
	}, [isOpenDialog])

	//set isopen of function
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: true,
	})

	//State ---------------------------------------------------------------------
	const [employeeIdUpdate, setEmployeeUpdate] = useState<number | null>(30)

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

	// get all employees
	const { data: allEmployees, mutate: refetchAllEmpl } = allEmployeesQuery(isAuthenticated)

	useEffect(() => {
		if (allEmployees?.employees) {
			let Allemployees = allEmployees.employees.map(
				({ id, email, name, role, employeeId, avatar }) => {
					return {
						id,
						email,
						name,
						role,
						employeeId,
						avatar: avatar?.url,
					}
				}
			)
			setData(Allemployees)
		}
	}, [allEmployees])

	// data------------------------------------
	const [employees, setData] = useState<any>([])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Employees',
			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					filter: textFilter('col1'),
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
					Header: 'Avatar',
					accessor: 'avatar',
					minWidth: 100,
					width: 100,
					disableResizing: true,
					disableSortBy: true,
					Cell: ({ value, row }) => {
						return <Avatar size={'sm'} name={row.values['name']} src={value} />
					},
				},
				{
					Header: 'Name',
					accessor: 'name',
					filter: arrayFilter('col3'),
					minWidth: 140,
					Cell: ({ value, row }) => {
						return (
							<Text isTruncated>
								{value}{' '}
								{currentUser?.email == row.values['email'] && (
									<Badge color={'white'} background={'gray.500'}>
										It's you
									</Badge>
								)}
							</Text>
						)
					},
				},
				{
					Header: 'Email',
					accessor: 'email',
					minWidth: 150,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'User role',
					accessor: 'role',
					minWidth: 160,
					Cell: ({ value }) => {
						return (
							<Select defaultValue={value}>
								{dataRoleEmployee.map((item) => (
									<option value={item.value} key={item.value}>
										{item.lable}
									</option>
								))}
							</Select>
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
								{/* {currentUser?.email != row.values['email'] && ( */}
								<MenuItem
									onClick={() => {
										onOpen()
									}}
									icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
								>
									Delete
								</MenuItem>
								{/* )} */}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	return (
		// <>

		// 	<Button colorScheme="blue" onClick={onOpenUpdate}>
		// 		open update employee
		// 	</Button>
		// 	<Drawer size="xl" title="Update Employee" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
		// 		<UpdateEmployees onCloseDrawer={onCloseUpdate} employeeId={employeeIdUpdate} />
		// 	</Drawer>
		// </>

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
				</HStack>
			</Collapse>
			<Table
				data={employees}
				columns={columns}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<string>) => setDataSl(data)}
			/>
			<AlertDialog
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialog}
				onClose={onClose}
			/>
			<Drawer size="xl" title="Add Employee" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddEmployees onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Employee" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateEmployees onCloseDrawer={onCloseUpdate} employeeId={employeeIdUpdate} />
			</Drawer>
		</Box>
	)
}

Employees.getLayout = ClientLayout

export default Employees
