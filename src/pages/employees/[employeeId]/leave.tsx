import {
	Avatar,
	Badge,
	Box,
	Button,
	Collapse,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
	Tag,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { EmployeeLayout } from 'components/layouts/Employee'
import { AuthContext } from 'contexts/AuthContext'
import { deleteLeaveMutation, deleteLeavesMutation, updateStatusMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allLeaveQuery, allLeaveTypesQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import {
	AiOutlineCaretDown,
	AiOutlineCaretUp,
	AiOutlineDelete,
	AiOutlineSearch,
} from 'react-icons/ai'
import { BsCheck2 } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { VscFilter } from 'react-icons/vsc'
import UpdateLeaves from 'src/pages/leaves/update-leaves'
import DetailLeave from 'src/pages/leaves/[leaveId]'
import { IOption } from 'type/basicTypes'
import { IPeople } from 'type/element/commom'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter, yearFilter } from 'utils/tableFilters'

// get current year
const year = new Date().getFullYear()

const LeavesEmployee: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

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

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	const [leaveId, setLeaveId] = useState<number | null>(30)

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// all leave type
	const [leaveTypes, setLeaveTypes] = useState<IOption[]>()

	// query and mutation -=------------------------------------------------------
	// get all leaves by id employee
	const { data: allLeaves, mutate: refetchAllLeaves } = allLeaveQuery({
		isAuthenticated,
		employee: employeeId as string,
	})

	// get all leave type
	const { data: allLeaveType } = allLeaveTypesQuery()

	// update status of leave
	const [mutateUpdateStatus, { status: statusUpStatus }] = updateStatusMutation(setToast)

	// delete leave
	const [mutateDeleteLeave, { status: statusDl }] = deleteLeaveMutation(setToast)

	// delete all leaves
	const [mutateDeleteLeaves, { status: statusDlMany }] = deleteLeavesMutation(setToast)

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
				msg: 'Delete leave successfully',
				type: 'success',
			})
			refetchAllLeaves()
		}
	}, [statusDl])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success') {
			setToast({
				msg: 'Delete leaves successfully',
				type: 'success',
			})
			setDataSl(null)
			refetchAllLeaves()
		}
	}, [statusDlMany])

	// set loading == false when get all leaves successfully
	useEffect(() => {
		if (allLeaves && allLeaves.leaves) {
			setIsloading(false)
		}
	}, [allLeaves])

	// set leavetypes when get all successfully
	useEffect(() => {
		if (allLeaveType) {
			const types = allLeaveType.leaveTypes?.map((item): IOption => {
				return {
					label: item.name,
					value: String(item.id),
				}
			})
			setLeaveTypes(types)
		}
	}, [allLeaveType])

	// alert when update status success
	useEffect(() => {
		if (statusUpStatus == 'success') {
			setToast({
				type: 'success',
				msg: 'Update status successfully',
			})
			refetchAllLeaves()
			setIsloading(false)
		}
	}, [statusUpStatus])

	useEffect(()=> {
		if(isOpenUpdate == false) {
			refetchAllLeaves()
		}
	}, [isOpenUpdate])

	// header ----------------------------------------
	const columns: TColumn[] = [
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
								<MenuItem onClick={()=> {
										setLeaveId(row.values['id'])
										onOpenDetail()
								}} icon={<IoEyeOutline fontSize={'15px'} />}>View</MenuItem>
								{row.values.status == 'Pending' && (
									<>
										<MenuItem
											onClick={() => {
												setIsloading(true)
												mutateUpdateStatus({
													status: 'Approved',
													leaveId: row.values['id'],
												})
											}}
											icon={<BsCheck2 fontSize={'15px'} />}
										>
											Approve
										</MenuItem>
										<MenuItem
											onClick={() => {
												setIsloading(true)
												mutateUpdateStatus({
													status: 'Rejected',
													leaveId: row.values['id'],
												})
											}}
											icon={<IoMdClose fontSize={'15px'} />}
										>
											Reject
										</MenuItem>
										<MenuItem
											onClick={() => {
												setLeaveId(row.values['id'])
												onOpenUpdate()
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>
									</>
								)}

								<MenuItem
									onClick={() => {
										setLeaveId(row.values['id'])
										onOpenDl()
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
				<SimpleGrid
					w={'full'}
					cursor={'pointer'}
					columns={[1, 2, 2, 3, null, 4]}
					spacing={10}
					pt={3}
				>
					<Func
						icon={<VscFilter />}
						description={'Open draw to filter'}
						title={'filter'}
						action={onOpenFilter}
					/>
					<Func
						icon={<AiOutlineDelete />}
						title={'Delete all'}
						description={'Delete all client you selected'}
						action={onOpenDlMany}
						disabled={!dataSl || dataSl.length == 0 ? true : false}
					/>
				</SimpleGrid>
			</Collapse>
			<br />

			{currentUser && (
				<Table
					data={allLeaves?.leaves || []}
					columns={columns}
					isLoading={isLoading}
					isSelect
					selectByColumn="id"
					setSelect={(data: Array<number>) => setDataSl(data)}
					filter={filter}
					disableColumns={['year']}
					isResetFilter={isResetFilter}
				/>
			)}

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					mutateDeleteLeave(String(leaveId))
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
						mutateDeleteLeaves(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			{/* drawer to detail leave */}
			<Drawer size="md" title="Detail leave" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailLeave leaveId={leaveId} />
			</Drawer>

			{/* drawer to update leave */}
			<Drawer size="xl" title="Update leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeaves onCloseDrawer={onCloseUpdate} leaveId={leaveId} />
			</Drawer>

			<Drawer
				footer={
					<Button
						onClick={() => {
							setIsReset(true)
							setTimeout(() => {
								setIsReset(false)
							}, 1000)
						}}
					>
						Reset
					</Button>
				}
				size="xs"
				title="Filter"
				isOpen={isOpenFilter}
				onClose={onCloseFilter}
			>
				<VStack spacing={5} p={6}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'email'}
						label="Email"
						placeholder="Enter email"
						required={false}
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<Select
						options={[
							{
								label: 'Pending',
								value: 'Pending',
							},
							{
								label: 'Rejected',
								value: 'Rejected',
							},
							{
								label: 'Approved',
								value: 'Approved',
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'status'}
						label="Leave status"
						placeholder="Select status"
						required={false}
					/>
					<Select
						options={[
							{
								label: String(year - 2),
								value: String(year - 2),
							},
							{
								label: String(year - 1),
								value: String(year - 1),
							},
							{
								label: String(year),
								value: String(year),
							},
							{
								label: String(year + 1),
								value: String(year + 1),
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'year'}
						label="Year"
						placeholder="Select year"
						required={false}
					/>

					<Select
						options={leaveTypes}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'leave_type'}
						label="Leave type"
						placeholder="Select type"
						required={false}
					/>

					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'date',
								filterValue: date,
							})
						}}
						label="Select date"
					/>
				</VStack>
			</Drawer>
		</Box>
	)
}

LeavesEmployee.getLayout = EmployeeLayout

export default LeavesEmployee
