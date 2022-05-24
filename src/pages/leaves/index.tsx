// query and mutation
import { allLeaveQuery, allLeaveTypesQuery } from 'queries'
import { deleteLeaveMutation, deleteLeavesMutation, updateStatusMutation } from 'mutations'

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
	Tag,
} from '@chakra-ui/react'
import {AlertDialog, Table} from 'components/common'
import {Drawer} from 'components/Drawer'

// use layout
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'

import { useContext, useEffect, useState } from 'react'

// icons
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineSearch } from 'react-icons/ai'
import { BiExport, BiImport } from 'react-icons/bi'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { IoMdClose } from 'react-icons/io'

import { NextLayout } from 'type/element/layout'

// fucs, component to setup table
import { IFilter, TColumn } from 'type/tableTypes'

// filter of column
import { dateFilter, selectFilter, textFilter, yearFilter } from 'utils/tableFilters'

// page add and update employee
import AddLeave from './add-leaves'

import UpdateLeave from './update-leaves'

// component to filter
import { Input, SelectUser, Select } from 'components/filter'
import {DateRange} from 'components/filter'

import { IPeople } from 'type/element/commom'
import { IOption } from 'type/basicTypes'
import { BsCheck2 } from 'react-icons/bs'

// get current year
const year = new Date().getFullYear()

const Leaves: NextLayout = () => {
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
	// get id to delete leave
	const [idDeleteLeave, setIdDeleteLeave] = useState<number>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	const [leaveIdUpdate, setLeaveIdUpdate] = useState<number | null>(30)

	// data all users to select
	const [dataUsersSl, setAllusersSl] = useState<IPeople[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// all leave type
	const [leaveTypes, setLeaveTypes] = useState<IOption[]>()

	// query and mutation -=------------------------------------------------------
	// get all leaves
	const { data: allLeaves, mutate: refetchAllLeaves } = allLeaveQuery({
		isAuthenticated
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
		if (allLeaves) {
			const users = allLeaves.leaves?.map((item): IPeople => {
				return {
					id: item.id,
					name: item.employee.name,
					avatar: item.employee.avatar?.url,
				}
			})
			setAllusersSl(users || [])
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
								<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>View</MenuItem>
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
												setLeaveIdUpdate(row.values['id'])
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
										setIdDeleteLeave(row.values['id'])
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
						Add leaves
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
						Invite Leave
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
					mutateDeleteLeave(String(idDeleteLeave))
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

			{/* drawer to add leave */}
			<Drawer size="xl" title="Add leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeave onCloseDrawer={onCloseAdd} />
			</Drawer>

			{/* drawer to update leave */}
			<Drawer size="xl" title="Update leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeave onCloseDrawer={onCloseUpdate} leaveId={leaveIdUpdate} />
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
							<SelectUser
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'id'}
								required={false}
								label={'User'}
								peoples={dataUsersSl}
							/>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

Leaves.getLayout = ClientLayout

export default Leaves
