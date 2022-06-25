import {
	Avatar,
	Badge,
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select,
	Tag,
	Text,
	VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { BsCheck2 } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { employeeType, IOption } from 'type/basicTypes'
import { TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter, yearFilter } from './tableFilters'

interface IOptionColumn {
	currentUser: employeeType | null
	onUpdate?: any
	onDelete?: any
	onDetail?: any
}

interface IEmployeeColumn extends IOptionColumn {
	onChangeRole: any
	dataRoleEmployee: IOption[]
}

interface ILeaveColumn extends IOptionColumn {
    onRejected: any
    onApproved: any
}

export const clientColumn = ({ currentUser, onDelete, onUpdate }: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Clients',

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
									<Link href={`/clients/${row.values['id']}`} passHref>
										<Text
											_hover={{
												textDecoration: 'underline',
												cursor: 'pointer',
											}}
											isTruncated
											w={'full'}
										>
											{row.original.salutation
												? `${row.original.salutation}. ${value}`
												: value}
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
									</Link>
									{row.original.company_name && (
										<Text
											isTruncated
											w={'full'}
											fontSize={'sm'}
											color={'gray.400'}
										>
											{row.original.company_name}
										</Text>
									)}
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
					Header: 'Created',
					accessor: 'createdAt',
					minWidth: 150,
					filter: dateFilter(['createdAt']),
					Cell: ({ value }) => {
						const createdDate = new Date(value).toLocaleDateString('en-GB')
						return <Text isTruncated>{createdDate}</Text>
					},
				},
				{
					Header: 'Category',
					accessor: 'category',
					filter: selectFilter(['client_category', 'id']),
				},
				{
					Header: 'Subcategory',
					accessor: 'subcategory',
					filter: selectFilter(['client_sub_category', 'id']),
				},
				{
					Header: 'Country',
					accessor: 'country',
					filter: selectFilter(['country']),
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
								<Link href={`/clients/${row.values['id']}`} passHref>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
								</Link>
								<MenuItem
									onClick={() => {
										onUpdate(row.values['id'])
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>
								{currentUser?.email != row.values['email'] && (
									<MenuItem
										onClick={() => {
											onDelete(row.values['id'])
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
}

export const employeeColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onChangeRole,
	dataRoleEmployee,
}: IEmployeeColumn): TColumn[] => {
	return [
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
									<Link href={`/clients/${row.values['id']}`} passHref>
										<Text
											_hover={{
												textDecoration: 'underline',
												cursor: 'pointer',
											}}
											isTruncated
											w={'full'}
										>
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
									</Link>

									<Text isTruncated w={'full'} fontSize={'sm'} color={'gray.400'}>
										{row.values['role']}
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
								<Select
									defaultValue={value}
									onChange={(event: any) => {
										onChangeRole(row.values['id'], event)
									}}
								>
									<option value={'Admin'}>Admin</option>
								</Select>
							)
						return (
							<Select
								defaultValue={value}
								onChange={(event: any) => {
									onChangeRole(row.values['id'], event)
								}}
							>
								{dataRoleEmployee.map((item) => (
									<option value={item.value} key={item.value}>
										{item.label}
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
								<Link href={`/employees/${row.values['id']}/detail`} passHref>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
								</Link>
								<MenuItem
									onClick={() => {
										onUpdate(row.values['id'])
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>
								{currentUser?.email != row.values['email'] && (
									<MenuItem
										onClick={() => {
											onDelete(row.values['id'])
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
}

export const leaveColumn = ({ currentUser, onDelete, onUpdate, onDetail, onApproved, onRejected }: ILeaveColumn): TColumn[] => {
	return [
		{
			Header: 'Leaves',

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
					Header: 'Name',
					accessor: 'name',
					minWidth: 250,
					Cell: ({ row }) => {
						const people = row.original.employee
						return (
							<HStack w={'full'} spacing={5}>
								<Avatar
									flex={'none'}
									size={'sm'}
									name={people.name}
									src={people.avatar?.url}
								/>
								<VStack w={'70%'} alignItems={'start'}>
									<Text isTruncated w={'full'}>
										{people.name}
										{currentUser?.email == people['email'] && (
											<Badge
												marginLeft={'5'}
												color={'white'}
												background={'gray.500'}
											>
												It's you
											</Badge>
										)}
									</Text>
									{people.designation && (
										<Text
											isTruncated
											w={'full'}
											fontSize={'sm'}
											color={'gray.400'}
										>
											{people.designation.name}
										</Text>
									)}
								</VStack>
							</HStack>
						)
					},
				},
				{
					Header: 'Email',
					accessor: 'email',
					minWidth: 150,
					filter: textFilter(['employee', 'email']),
					Cell: ({ row }) => {
						return <Text isTruncated>{row.original.employee.email}</Text>
					},
				},

				{
					Header: 'Leave date',
					accessor: 'date',
					filter: dateFilter(['date']),
					minWidth: 150,
					Cell: ({ value }) => {
						return <Text>{new Date(value).toLocaleDateString('en-GB')}</Text>
					},
				},
				{
					Header: 'year',
					accessor: 'year',
					filter: yearFilter(['date']),
				},
				{
					Header: 'Leave status',
					accessor: 'status',
					minWidth: 150,
					filter: selectFilter(['status']),
					Cell: ({ value }) => {
						return (
							<HStack alignItems={'center'}>
								<Box
									background={
										value == 'Pending'
											? 'yellow.200'
											: value == 'Approved'
											? 'hu-Green.normal'
											: 'red'
									}
									w={'3'}
									borderRadius={'full'}
									h={'3'}
								/>
								<Text>{value}</Text>
							</HStack>
						)
					},
				},
				{
					Header: 'Leave type',
					accessor: 'leave_type',
					minWidth: 150,
					filter: selectFilter(['leave_type', 'id']),
					Cell: ({ value }) => {
						return (
							<Tag bg={`${value.color_code}30`} color={value.color_code} isTruncated>
								{value.name}
							</Tag>
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
								<MenuItem
									onClick={() => {
										onDetail(row.values['id'])
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
								{row.values.status == 'Pending' && (
									<>
										<MenuItem
											onClick={() => {
                                                onApproved(row.values['id'])
											}}
											icon={<BsCheck2 fontSize={'15px'} />}
										>
											Approve
										</MenuItem>
										<MenuItem
											onClick={() => {
                                                onRejected(row.values['id'])
											}}
											icon={<IoMdClose fontSize={'15px'} />}
										>
											Reject
										</MenuItem>
										<MenuItem
											onClick={() => {
												onUpdate(row.values['id'])
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>
									</>
								)}

								<MenuItem
									onClick={() => {
										onDelete(row.values['id'])
									}}
									icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
								>
									Delete
								</MenuItem>
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}
