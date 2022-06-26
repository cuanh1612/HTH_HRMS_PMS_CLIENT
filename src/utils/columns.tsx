import {
	Avatar,
	AvatarGroup,
	Badge,
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Progress,
	Select,
	Tag,
	Text,
	Tooltip,
	VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { BiLinkAlt } from 'react-icons/bi'
import { BsCheck2 } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import {
	clientType,
	employeeType,
	IOption,
	projectCategoryType,
	timeLogType,
} from 'type/basicTypes'
import { TColumn } from 'type/tableTypes'
import {
	arrayFilter,
	dateFilter,
	monthFilter,
	selectFilter,
	textFilter,
	yearFilter,
} from './tableFilters'

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

interface IContractColumn extends IOptionColumn {
	onPublic: any
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

export const leaveColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onDetail,
	onApproved,
	onRejected,
}: ILeaveColumn): TColumn[] => {
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

export const holidayColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onDetail,
}: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Holidays',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
				},
				{
					Header: 'Date',
					filter: yearFilter(['holiday_date']),
					accessor: 'holiday_date',
					minWidth: 150,
					width: 150,
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'Occasion',
					filter: textFilter(['occasion']),
					accessor: 'occasion',
					minWidth: 250,
					width: 500,
				},
				{
					Header: 'Day',
					filter: monthFilter(['holiday_date']),
					accessor: 'day',
					minWidth: 150,
					width: 150,
					Cell: ({ row }) => {
						let daysArray = [
							'Sunday',
							'Monday',
							'Tuesday',
							'Wednesday',
							'Thursday',
							'Friday',
							'Saturday',
						]
						const date = new Date(row.values['holiday_date']).getDay()
						return <Text>{daysArray[date]}</Text>
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
								{currentUser && currentUser.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												onUpdate(row.values['id'])
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>
										<MenuItem
											onClick={() => {
												onDelete(row.values['id'])
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}

export const contractColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onPublic,
}: IContractColumn): TColumn[] => {
	return [
		{
			Header: 'Contracts',

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
					Header: 'Subject',
					accessor: 'subject',
					minWidth: 180,
					width: 180,
					filter: textFilter(['subject']),
					Cell: ({ value, row }) => (
						<Text
							_hover={{
								color: 'hu-Green.normal',
							}}
						>
							<Link key={row.values['id']} href={`/contracts/${row.values['id']}`}>
								{value}
							</Link>
						</Text>
					),
				},
				{
					Header: 'Contract type',
					accessor: 'contract_type',
					minWidth: 180,
					width: 180,
					filter: selectFilter(['contract_type', 'id']),
					Cell: () => '',
				},
				{
					Header: 'Client',
					accessor: 'client',
					minWidth: 250,
					filter: selectFilter(['client', 'id']),
					Cell: ({ row }) => {
						return (
							<HStack w={'full'} spacing={5}>
								<Avatar
									flex={'none'}
									size={'sm'}
									name={row.original.client.name}
									src={row.original.client.avatar?.url}
								/>
								<VStack w={'70%'} alignItems={'start'}>
									<Text isTruncated w={'full'}>
										{row?.original.client.salutation
											? `${row.original.client.salutation}. ${row.original.client.name}`
											: row.original.client.name}
									</Text>
									<Text isTruncated w={'full'} fontSize={'sm'} color={'gray.400'}>
										{row.original.client.company_name}
									</Text>
								</VStack>
							</HStack>
						)
					},
				},
				{
					Header: 'Amount',
					accessor: 'amount',
					minWidth: 180,
					width: 180,
					Cell: ({ row }) => (
						<Text>{`${row.original.contract_value} ${row.original.currency}`}</Text>
					),
				},
				{
					Header: 'Start date',
					accessor: 'start_date',
					minWidth: 180,
					width: 180,
					filter: dateFilter(['start_date']),
					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'End date',
					accessor: 'end_date',
					minWidth: 180,
					width: 180,
					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
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
								<Link
									key={row.values['id']}
									href={`/contracts/${row.values['id']}`}
								>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										view
									</MenuItem>
								</Link>
								{currentUser?.role == 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												onPublic(row.values['id'])
											}}
											icon={<BiLinkAlt fontSize={'15px'} />}
										>
											Public Link
										</MenuItem>
										<MenuItem
											onClick={() => {
												onUpdate(row.values['id'])
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												onDelete(row.values['id'])
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}

export const projectColumn = ({ currentUser, onDelete, onUpdate }: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Projects',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
				},
				{
					Header: 'Project name',
					accessor: 'name',
					minWidth: 200,
					width: 200,
					Cell: ({ value, row }) => (
						<Link href={`/projects/${row.values['id']}/overview`} passHref>
							<Text
								_hover={{
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
								isTruncated={true}
							>
								{value}
							</Text>
						</Link>
					),
					filter: textFilter(['name']),
				},
				{
					Header: 'project_category',
					accessor: 'project_category',
					minWidth: 200,
					width: 200,
					Cell: ({ value }: { value: projectCategoryType }) => (
						<Text isTruncated={true}>{value.name}</Text>
					),
					filter: selectFilter(['project_category', 'id']),
				},
				{
					Header: 'Members',
					accessor: 'employees',
					minWidth: 150,
					width: 150,
					filter: arrayFilter(['employees'], 'id'),
					Cell: ({ value }: { value: employeeType[] }) => {
						return (
							<AvatarGroup size="sm" max={4}>
								{value.map((employee) => (
									<Avatar
										key={employee.id}
										name={employee.name}
										src={employee.avatar?.url}
									/>
								))}
							</AvatarGroup>
						)
					},
				},
				{
					Header: 'Deadline',
					accessor: 'deadline',
					minWidth: 150,
					width: 150,
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'Client',
					accessor: 'client',
					minWidth: 250,
					filter: selectFilter(['client', 'id']),
					Cell: ({ value }: { value: clientType }) => (
						<>
							{value ? (
								<HStack w={'full'} spacing={5}>
									<Avatar
										flex={'none'}
										size={'sm'}
										name={value.name}
										src={value.avatar?.url}
									/>
									<VStack w={'70%'} alignItems={'start'}>
										<Text isTruncated w={'full'}>
											{value.salutation
												? `${value.salutation}. ${value.name}`
												: value.name}
										</Text>
										{value.company_name && (
											<Text
												isTruncated
												w={'full'}
												fontSize={'sm'}
												color={'gray.400'}
											>
												{value.company_name}
											</Text>
										)}
									</VStack>
								</HStack>
							) : (
								''
							)}
						</>
					),
				},
				{
					Header: 'Progress',
					accessor: 'Progress',
					minWidth: 150,
					width: 150,
					Cell: ({ value }: { value: employeeType[] }) => {
						return (
							<Tooltip hasArrow label={`${value}%`} shouldWrapChildren mt="3">
								<Progress
									hasStripe
									borderRadius={5}
									colorScheme={
										Number(value) < 50
											? 'red'
											: Number(value) < 70
											? 'yellow'
											: 'green'
									}
									size="lg"
									value={Number(value)}
								/>
							</Tooltip>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'project_status',
					minWidth: 150,
					width: 150,
					Cell: ({ value }: { value: string }) => {
						var color = ''
						switch (value) {
							case 'Not Started':
								color = 'gray.500'
								break
							case 'In Progress':
								color = 'blue.500'
								break
							case 'On Hold':
								color = 'yellow.500'
								break
							case 'Canceled':
								color = 'red.500'
								break
							case 'Finished':
								color = 'green.500'
								break
						}
						return (
							<HStack alignItems={'center'}>
								<Box background={color} w={'3'} borderRadius={'full'} h={'3'} />
								<Text>{value}</Text>
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
								<MenuItem
									onClick={() => {}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>

								{currentUser && currentUser.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												onUpdate(row.values['id'])
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>
										<MenuItem
											onClick={() => {
												onDelete(row.values['id'])
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}

export const TasksColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onDetail,
}: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Tasks',
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
					Header: 'Task',
					accessor: 'name',
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
					filter: textFilter(['name']),
				},
				{
					Header: 'Project',
					accessor: 'project',
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
					filter: selectFilter(['project', 'id']),
				},
				{
					Header: 'Deadline',
					accessor: 'deadline',
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text
								color={date.getTime() <= new Date().getTime() ? 'red' : 'black'}
								isTruncated
							>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
					filter: dateFilter(['deadline']),
				},
				{
					Header: 'Hours Logged',
					accessor: 'time_logs',
					Cell: ({ value }) => {
						var result
						if (value.length == 0) {
							result = 0
						} else {
							value.map((item: timeLogType) => {
								result = item.total_hours
							})
						}

						return <Text isTruncated>{result} hrs</Text>
					},
				},
				{
					Header: 'milestone',
					accessor: 'milestone',
					Cell: ({ value }) => {
						return <Text isTruncated>{value?.title}</Text>
					},
					filter: selectFilter(['milestone', 'id']),
				},
				{
					Header: 'Task Category',
					accessor: 'task_category',
					Cell: ({ value }) => {
						return <Text isTruncated>{value?.name}</Text>
					},
					filter: selectFilter(['task_category', 'id']),
				},

				{
					Header: 'Assign to',
					accessor: 'employees',
					filter: arrayFilter(['employees'], 'id'),
					Cell: ({ value }) => {
						return (
							<AvatarGroup size="sm" max={2}>
								{value.length != 0 &&
									value.map((employee: employeeType) => (
										<Avatar
											name={employee.name}
											key={employee.id}
											src={employee.avatar?.url}
										/>
									))}
							</AvatarGroup>
						)
					},
				},
				{
					Header: 'Assign By',
					accessor: 'assignBy',
					filter: selectFilter(['assignBy', 'id']),
					Cell: ({ value }) => {
						return value?.name
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					Cell: ({ value }) => (
						<HStack alignItems={'center'}>
							<Box background={value.color} w={'3'} borderRadius={'full'} h={'3'} />
							<Text>{value.title}</Text>
						</HStack>
					),
					filter: selectFilter(['status', 'id']),
				},
				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => {
						return (
							<Menu>
								<MenuButton as={Button} paddingInline={3}>
									<MdOutlineMoreVert />
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() => {
											onDetail(Number(row.values['id']))
										}}
										icon={<IoEyeOutline fontSize={'15px'} />}
									>
										View
									</MenuItem>

									{(currentUser?.role === 'Admin' ||
										(currentUser?.role === 'Employee' &&
											row.original?.assignBy?.id === currentUser?.id)) && (
										<>
											<MenuItem
												onClick={() => {
													onUpdate(Number(row.values['id']))
												}}
												icon={<RiPencilLine fontSize={'15px'} />}
											>
												Edit
											</MenuItem>

											<MenuItem
												onClick={() => {
													onDelete(Number(row.values['id']))
												}}
												icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
											>
												Delete
											</MenuItem>
										</>
									)}
								</MenuList>
							</Menu>
						)
					},
				},
			],
		},
	]
}

export const timeLogsColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onDetail,
}: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Time logs',

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
					Header: 'Task',
					accessor: 'task',
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
					filter: textFilter(['task', 'name']),
				},
				{
					Header: 'Project',
					accessor: 'project',
					Cell: ({ value }) => {
						return <Text isTruncated>{value?.name}</Text>
					},
					filter: selectFilter(['project', 'id']),
				},
				{
					Header: 'Employee',
					accessor: 'employee',
					minWidth: 250,
					Cell: ({ value }) => {
						return (
							<>
								{value ? (
									<HStack w={'full'} spacing={5}>
										<Avatar
											flex={'none'}
											size={'sm'}
											name={value.name}
											src={value.avatar?.url}
										/>
										<VStack w={'70%'} alignItems={'start'}>
											<Text isTruncated w={'full'}>
												{value.name}
												{currentUser?.email == value.email && (
													<Badge
														marginLeft={'5'}
														color={'white'}
														background={'gray.500'}
													>
														It's you
													</Badge>
												)}
											</Text>
											<Text
												isTruncated
												w={'full'}
												fontSize={'sm'}
												color={'gray.400'}
											>
												Junior
											</Text>
										</VStack>
									</HStack>
								) : (
									''
								)}
							</>
						)
					},
				},
				{
					Header: 'Start Time',
					accessor: 'starts_on_date',
					filter: dateFilter(['starts_on_date']),
					Cell: ({ value, row }) => {
						const date = new Date(value)
						return (
							<Text isTruncated>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()} ${row.original['starts_on_time']}`}</Text>
						)
					},
				},
				{
					Header: 'End Time',
					accessor: 'ends_on_date',
					minWidth: 150,
					filter: dateFilter(['ends_on_date']),
					Cell: ({ value, row }) => {
						const date = new Date(value)
						return (
							<Text isTruncated>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()} ${row.original['ends_on_time']}`}</Text>
						)
					},
				},
				{
					Header: 'Total Hours',
					minWidth: 150,
					accessor: 'total_hours',
					Cell: ({ value }) => {
						return <Text isTruncated>{value} hrs</Text>
					},
				},
				{
					Header: 'Earnings',
					accessor: 'earnings',
					Cell: ({ value }) => {
						return (
							<Text isTruncated>
								{Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									useGrouping: false,
								}).format(Number(value))}
							</Text>
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
								{currentUser?.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												onUpdate(row.values['id'])
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												onDelete(row.values['id'])
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}

export const noticeBoardColumn = ({
	currentUser,
	onDelete,
	onUpdate,
	onDetail
}: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Notice board',
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
					Header: 'Notice',
					accessor: 'heading',
					filter: textFilter(['heading']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Date',
					accessor: 'updatedAt',
					filter: dateFilter(['updatedAt']),
					minWidth: 180,
					width: 180,
					disableResizing: true,
					Cell: ({ value }) => {
						return (
							<Text isTruncated>{`${new Date(value).getDate()}-${
								new Date(value).getUTCMonth() + 1
							}-${new Date(value).getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'To',
					accessor: 'notice_to',
					filter: selectFilter(['notice_to']),
					minWidth: 180,
					width: 180,
					disableResizing: true,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
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
								<MenuItem onClick={() => {
									onDetail(Number(row.values['id']))
								}} icon={<IoEyeOutline fontSize={'15px'} />}>View</MenuItem>
								{currentUser?.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												onUpdate(Number(row.values['id']))
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												onDelete(Number(row.values['id']))
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}
