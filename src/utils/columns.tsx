import {
	Avatar,
	AvatarGroup,
	Badge,
	Box,
	Button,
	ButtonGroup,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Progress,
	Radio,
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
import { clientType, employeeType, projectCategoryType, timeLogType } from 'type/basicTypes'
import {
	ICandidateColumn,
	IContractColumn,
	IEmployeeColumn,
	IJobColumn,
	ILeaveColumn,
	IOptionColumn,
	IProjectMemberColumn,
	IProjectTimeLogsColumn,
} from 'type/columnType'
import { TColumn } from 'type/tableTypes'
import { dataInterviewStatus, dataJobApplicationStatus, dataJobStatus } from './basicData'
import {
	arrayFilter,
	dateFilter,
	monthFilter,
	selectFilter,
	textFilter,
	yearFilter,
} from './tableFilters'

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
						const createdDate = new Date(value).toLocaleDateString('es-CL')
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
									<Link href={`/employees/${row.values['id']}/detail`} passHref>
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
										{row.original['department']?.name || '--'}
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
								{dataRoleEmployee.map((item, key) => (
									<option key={key} value={item.value}>
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
						return <Text>{new Date(value).toLocaleDateString('es-CL')}</Text>
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

								{currentUser?.role == 'Admin' && row.values.status == 'Pending' && (
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
								textDecoration: 'underline',
							}}
						>
							<Link
								key={row.values['id']}
								href={`/contracts/${row.values['id']}/detail`}
							>
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
									href={`/contracts/${row.values['id']}/detail`}
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
					Cell: ({ value, row }) => {
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
												{row.original['department']?.name || '--'}
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
	onDetail,
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
								<MenuItem
									onClick={() => {
										onDetail(Number(row.values['id']))
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
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

export const salariesColumn = ({ currentUser, onDetail, onUpdate }: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Salaries',

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
									<Text isTruncated w={'full'}>
										{value}
										{currentUser?.email == row.original['email'] && (
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
										{row.original['department']?.name || '--'}
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
					Header: 'Salary',
					accessor: 'sumSalaries',
					minWidth: 150,
					filter: textFilter(['email']),
					Cell: ({ value }) => {
						return (
							<Text isTruncated color={'red'} fontWeight={'semibold'}>
								${value}
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
									Show history
								</MenuItem>

								<MenuItem
									onClick={() => {
										onUpdate(row.values['id'])
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Update salary
								</MenuItem>
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]
}

export const projectMembersColumn = ({
	currentUser,
	onDelete,
	project_Admin,
	setAdmin,
	setHourlyRate,
}: IProjectMemberColumn): TColumn[] => {
	return [
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
										{row.original['department']?.name || '--'}
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
							onChange={(value: any) => {
								setHourlyRate(Number(row.values['id']), Number(value))
							}}
							defaultValue={Number(value?.hourly_rate)}
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
						if (currentUser?.role === 'Admin') {
							return (
								<HStack spacing={4}>
									<Radio
										onChange={() => {
											setAdmin(row.values['id'])
										}}
										isChecked={
											project_Admin
												? project_Admin.id == row.values['id']
												: false
										}
										value={row.values['id']}
									/>
									<Text>Project Admin</Text>
								</HStack>
							)
						} else {
							return (
								<Text>
									{project_Admin && project_Admin.id == row.values['id']
										? 'Project Admin'
										: '--'}
								</Text>
							)
						}
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
								onDelete(Number(row.values['id']))
							}}
						>
							Delete
						</Button>
					),
				},
			],
		},
	]
}

export const projectTasksColumn = ({
	currentUser,
	onDelete,
	onDetail,
	onUpdate,
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
				},
				{
					Header: 'Deadline',
					accessor: 'deadline',
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text color={'red'} isTruncated>{`${date.getDate()}-${
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
					Header: 'Assign to',
					accessor: 'employees',
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
					Cell: ({ row }) => (
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
					),
				},
			],
		},
	]
}

export const projectTimeLogsColumn = ({
	currentUser,
	onDelete,
	onDetail,
	onUpdate,
	project_Admin,
}: IProjectTimeLogsColumn): TColumn[] => {
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
					Header: 'Employee',
					accessor: 'employee',
					minWidth: 250,
					Cell: ({ value, row }) => {
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
												{row.original['department']?.name || '--'}
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
					Header: 'Status',
					minWidth: 150,
					accessor: 'status',
					filter: selectFilter(['task', 'status', 'id']),
					Cell: ({ row }) => {
						return <Text isTruncated>{row.original['task'].status.title}</Text>
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
										onDetail(Number(row.values['id']))
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
								{((currentUser && currentUser.role === 'Admin') ||
									(currentUser &&
										project_Admin &&
										currentUser.email === project_Admin.email)) && (
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

export const projectNotesColumn = ({
	currentUser,
	onDelete,
	onDetail,
	onUpdate,
	project_Admin,
}: IProjectTimeLogsColumn): TColumn[] => {
	return [
		{
			Header: 'Notes',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
				},
				{
					Header: 'Note title',
					accessor: 'title',
					minWidth: 150,
					filter: textFilter(['title']),
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Type',
					accessor: 'note_type',
					minWidth: 150,
					filter: selectFilter(['note_type']),
					Cell: ({ value }) => {
						return <Tag colorScheme={value == 'Private' ? 'red' : 'green'}>{value}</Tag>
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
								{row.original['note_type'] === 'Public' ||
								(currentUser && currentUser.role === 'Admin') ||
								(currentUser && currentUser.role === 'Client') ? (
									<MenuItem
										onClick={() => {
											onDetail({
												id: row.values['id'],
												askPassword: row.original['ask_re_password'],
											})
										}}
										icon={<IoEyeOutline fontSize={'15px'} />}
									>
										View
									</MenuItem>
								) : (
									((row.original['employees'] &&
										currentUser?.role === 'Employee' &&
										row.original['employees'].some(
											(employeeItem: any) =>
												employeeItem.id === currentUser.id
										)) ||
										currentUser?.role == 'Admin') && (
										<MenuItem
											onClick={() => {
												onDetail({
													id: row.values['id'],
													askPassword: row.original['ask_re_password'],
												})
											}}
											icon={<IoEyeOutline fontSize={'15px'} />}
										>
											View
										</MenuItem>
									)
								)}
								{((currentUser && currentUser.role === 'Admin') ||
									(currentUser &&
										project_Admin &&
										currentUser.email === project_Admin.email)) && (
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

export const projecMilestonesColumn = ({
	onDelete,
	onDetail,
	onUpdate,
}: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Milestones',
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
					Header: 'Milestone Title',
					accessor: 'title',
					width: 180,
					minWidth: 180,
				},
				{
					Header: 'Milestone Cost',
					accessor: 'cost',
					width: 180,
					minWidth: 180,
					Cell: ({ value }) => `$${value}`,
				},
				{
					Header: 'Status',
					accessor: 'status',
					width: 180,
					minWidth: 180,
					Cell: ({ value }) => (
						<HStack alignItems={'center'} spacing={4}>
							<Box
								background={value ? 'hu-Green.normal' : 'red.300'}
								w={'2'}
								borderRadius={'full'}
								h={'2'}
							/>
							<Text>{value ? 'Complete' : 'Incomplete'}</Text>
						</HStack>
					),
				},
				{
					Header: 'Action',
					accessor: 'action',
					width: 150,
					minWidth: 150,
					disableResizing: true,
					Cell: ({ row }) => (
						<ButtonGroup isAttached variant="outline">
							<Button
								onClick={() => {
									onDetail(Number(row.values['id']))
								}}
							>
								View
							</Button>
							<Menu>
								<MenuButton as={Button} paddingInline={3}>
									<MdOutlineMoreVert />
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() => {
											onUpdate(row.values['id'], row)
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
								</MenuList>
							</Menu>
						</ButtonGroup>
					),
				},
			],
		},
	]
}

export const employeeProjectColumn = ({
	onDelete,
	onUpdate,
	currentUser,
}: IOptionColumn): TColumn[] => {
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
								<Link href={`/projects/${row.values['id']}/overview`} passHref>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
								</Link>

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

export const employeeTasksColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
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
							<Text color={'red'} isTruncated>{`${date.getDate()}-${
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

export const employeeTimeLogsColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
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
					Cell: ({ value, row }) => {
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
												{row.original['department']?.name || '--'}
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
										onDetail(Number(row.values['id']))
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
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

export const employeeLeavesColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
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
						return <Text>{new Date(value).toLocaleDateString('es-CL')}</Text>
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

export const SkillsColumn = ({ onDelete, onUpdate, currentUser }: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Skills',
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
					Header: 'Name',
					accessor: 'name',
					filter: textFilter(['heading']),
					minWidth: 80,
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

export const clientProjectsColumn = ({
	onDelete,
	onUpdate,
	currentUser,
}: IOptionColumn): TColumn[] => {
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
								<Link href={`/projects/${row.values['id']}/overview`} passHref>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
								</Link>

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

export const jobColumn = ({
	onDelete,
	onUpdate,
	currentUser,
	onChangeStatus,
}: IJobColumn): TColumn[] => {
	return [
		{
			Header: 'Jobs',
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
					Header: 'Title',
					accessor: 'title',
					filter: textFilter(['title']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Start date',
					accessor: 'starts_on_date',
					minWidth: 180,
					width: 180,
					filter: dateFilter(['starts_on_date']),
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
					accessor: 'ends_on_date',
					minWidth: 180,
					width: 180,

					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (
							<Text
								color={
									new Date(value as string).getTime() <= new Date().getTime()
										? 'red'
										: undefined
								}
							>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),

					minWidth: 160,
					Cell: ({ value, row }) => {
						return (
							<Select
								onChange={async (event: any) => {
									await onChangeStatus(row.values['id'], event)
								}}
								defaultValue={value == true ? 'Open' : 'Close'}
							>
								{dataJobStatus.map((e, key) => (
									<option key={key} value={e.value}>
										{e.label}
									</option>
								))}
							</Select>
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
								<Link href={`/jobs/${row.values['id']}/profile`} passHref>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
								</Link>
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

export const jobApplicationColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
	onChangeStatus,
}: IJobColumn): TColumn[] => {
	return [
		{
			Header: 'Job applications',
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
					Header: 'Name',
					accessor: 'name',
					filter: textFilter(['title']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Job',
					accessor: 'jobs',
					filter: textFilter(['jobs', 'id']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.title}</Text>
					},
				},
				{
					Header: 'Location',
					accessor: 'location',
					filter: selectFilter(['location', 'name']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
				},
				{
					Header: 'Date',
					accessor: 'createdAt',
					filter: dateFilter(['createdAt']),
					minWidth: 80,
					Cell: ({ value }) => {
						return (
							<Text isTruncated>{new Date(value).toLocaleDateString('es-CL')}</Text>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),

					minWidth: 160,
					Cell: ({ value, row }) => {
						return (
							<Select
								onChange={async (event) => {
									await onChangeStatus(row.values['id'], event)
								}}
								defaultValue={value}
							>
								{dataJobApplicationStatus.map((e, key) => (
									<option key={key} value={e.value}>
										{e.label}
									</option>
								))}
							</Select>
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

export const candidateColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
	onChangeStatus,
}: ICandidateColumn): TColumn[] => {
	return [
		{
			Header: 'Candidates',

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
					Cell: ({ value }) => {
						return (
							<Text isTruncated w={'full'}>
								{value}
							</Text>
						)
					},
				},
				{
					Header: 'Job',
					accessor: 'jobs',
					filter: textFilter(['jobs', 'id']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.title}</Text>
					},
				},
				{
					Header: 'Location',
					accessor: 'location',
					filter: selectFilter(['location', 'name']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
				},

				{
					Header: 'Date',
					accessor: 'createdAt',
					filter: dateFilter(['createdAt']),
					minWidth: 80,
					Cell: ({ value }) => {
						return (
							<Text isTruncated>{new Date(value).toLocaleDateString('es-CL')}</Text>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),

					minWidth: 160,
					Cell: ({ value, row }) => {
						return (
							<Select
								onChange={async (event) => {
									await onChangeStatus(row.values['id'], event)
								}}
								defaultValue={value}
							>
								{dataJobApplicationStatus.map((e, key) => (
									<option key={key} value={e.value}>
										{e.label}
									</option>
								))}
							</Select>
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

export const interviewScheduleColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
	onChangeStatus,
}: IJobColumn): TColumn[] => {
	return [
		{
			Header: 'Interview schedules',
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
					Header: 'Candidate',
					accessor: 'candidate',
					filter: textFilter(['candidate', 'name']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
				},
				{
					Header: 'Schedule date and time',
					accessor: 'date',
					filter: dateFilter(['date']),
					minWidth: 80,
					Cell: ({ value, row }) => {
						return (
							<Text isTruncated>{`${new Date(value).toLocaleDateString('es-CL')} ${
								row.original.start_time
							}`}</Text>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),
					minWidth: 160,
					width: 160,
					Cell: ({ value, row }) => {
						return (
							<Select
								onChange={async (event) => {
									await onChangeStatus(row.values['id'], event)
								}}
								defaultValue={value}
							>
								{dataInterviewStatus.map((e, key) => (
									<option key={key} value={e.value}>
										{e.label}
									</option>
								))}
							</Select>
						)
					},
				},

				{
					Header: 'Interviewers',
					accessor: 'interviewer',
					minWidth: 150,
					width: 150,
					filter: arrayFilter(['interviewer'], 'id'),
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


export const jobInterviewColumn = ({
	onDelete,
	onUpdate,
	onDetail,
	currentUser,
	onChangeStatus,
}: IJobColumn): TColumn[] => {
	return [
		{
			Header: 'Interview schedules',
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
					Header: 'Candidate',
					accessor: 'candidate',
					filter: textFilter(['candidate', 'name']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
				},
				{
					Header: 'Schedule date and time',
					accessor: 'date',
					filter: dateFilter(['date']),
					minWidth: 80,
					Cell: ({ value, row }) => {
						return (
							<Text isTruncated>{`${new Date(value).toLocaleDateString('es-CL')} ${
								row.original.start_time
							}`}</Text>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),
					minWidth: 160,
					width: 160,
					Cell: ({ value, row }) => {
						return (
							<Select
								onChange={async (event) => {
									await onChangeStatus(row.values['id'], event)
								}}
								defaultValue={value}
							>
								{dataInterviewStatus.map((e, key) => (
									<option key={key} value={e.value}>
										{e.label}
									</option>
								))}
							</Select>
						)
					},
				},

				{
					Header: 'Interviewers',
					accessor: 'interviewer',
					minWidth: 150,
					width: 150,
					filter: arrayFilter(['interviewer'], 'id'),
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

export const offerLettersColumn = ({
	onDelete,
	onUpdate,
	currentUser,
}: IOptionColumn): TColumn[] => {
	return [
		{
			Header: 'Offer letters',
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
					Header: 'Job',
					accessor: 'job',
					filter: selectFilter(['job', 'id']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.title}</Text>
					},
				},
				{
					Header: 'Job applicant',
					accessor: 'job_application',
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
				},

				{
					Header: 'Expected joining date',
					accessor: 'expected_joining_date',
					filter: dateFilter(['date']),
					minWidth: 80,
					Cell: ({ value }) => {
						return (
							<Text
								color={
									new Date(value).getTime() < new Date().getTime()
										? 'red'
										: undefined
								}
								isTruncated
							>
								{new Date(value).toLocaleDateString('es-CL')}
							</Text>
						)
					},
				},

				{
					Header: 'Offer expire on',
					accessor: 'exprise_on',
					filter: dateFilter(['date']),
					minWidth: 80,
					Cell: ({ value }) => {
						return (
							<Text
								color={
									new Date(value).getTime() < new Date().getTime()
										? 'red'
										: undefined
								}
								isTruncated
							>
								{new Date(value).toLocaleDateString('es-CL')}
							</Text>
						)
					},
				},

				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),
					minWidth: 80,
					Cell: ({ value }) => {
						return (
							<HStack spacing={3}>
								<Box
									w={'10px'}
									h={'10px'}
									borderRadius={'full'}
									bg={
										value == 'Pending'
											? 'yellow'
											: value == 'Rejected'
											? 'red'
											: 'Green'
									}
								/>
								<Text isTruncated>{value}</Text>
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
								<Link href={`/job-offer-letters/${row.values['id']}`}>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
								</Link>

								{currentUser?.role === 'Admin' && (
									<>
										<Link
											href={`/job-offer-letters/public/${row.original['token']}`}
										>
											<MenuItem icon={<BiLinkAlt fontSize={'15px'} />}>
												Public Link
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
