// query and mutation
import { deleteLeaveMutation, deleteLeavesMutation, updateStatusMutation } from 'mutations'
import { allLeaveQuery, allLeaveTypesQuery } from 'queries'

// components
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
import { CSVLink } from 'react-csv'

// use layout
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'

import { useContext, useEffect, useState } from 'react'

// icons
import {
	AiOutlineCaretDown,
	AiOutlineCaretUp,
	AiOutlineDelete,
	AiOutlineSearch,
} from 'react-icons/ai'
import { BiExport } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineEvent, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'

import { NextLayout } from 'type/element/layout'

// fucs, component to setup table
import { IFilter, TColumn } from 'type/tableTypes'

// filter of column
import { dateFilter, selectFilter, textFilter, yearFilter } from 'utils/tableFilters'

// page add and update employee
import AddCurrentLeave from './add-current-leave'
import AddLeave from './add-leaves'

import UpdateLeave from './update-leaves'

// component to filter
import { DateRange, Input, Select, SelectUser } from 'components/filter'

import { BsCheck2 } from 'react-icons/bs'
import { IOption } from 'type/basicTypes'
import { IPeople } from 'type/element/commom'
import { VscFilter } from 'react-icons/vsc'
import DetailLeave from './[leaveId]'
import { leaveColumn } from 'utils/columns'
import { dataStatusLeave } from 'utils/basicData'

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

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	const [leaveId, setLeaveId] = useState<number | null>(30)

	// data all users to select
	const [dataUsersSl, setAllusersSl] = useState<IPeople[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// all leave type
	const [leaveTypes, setLeaveTypes] = useState<IOption[]>()

	// query and mutation -=------------------------------------------------------
	// get all leaves
	const { data: allLeaves, mutate: refetchAllLeaves } = allLeaveQuery({
		isAuthenticated,
		...(currentUser?.role === 'Employee' ? { employee: currentUser?.id } : {}),
	})

	// get all leave type
	const { data: allLeaveType } = allLeaveTypesQuery()

	// update status of leave
	const [mutateUpdateStatus, { status: statusUpStatus }] = updateStatusMutation(setToast)

	// delete leave
	const [mutateDeleteLeave, { status: statusDl }] = deleteLeaveMutation(setToast)

	// delete all leaves
	const [mutateDeleteLeaves, { status: statusDlMany }] = deleteLeavesMutation(setToast)

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'date', key: 'date' },
		{ label: 'duration', key: 'duration' },
		{ label: 'employee', key: 'employee' },
		{ label: 'leave_type', key: 'leave_type' },
		{ label: 'reason', key: 'reason' },
		{ label: 'status', key: 'status' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

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
			const users = allLeaves.leaves?.map((item): IPeople => {
				return {
					id: item.id,
					name: item.employee.name,
					avatar: item.employee.avatar?.url,
				}
			})
			setAllusersSl(users || [])
			setIsloading(false)

			//Set data csv
			const dataCSV: any[] = allLeaves.leaves.map((leave) => ({
				id: leave.id,
				date: leave.date,
				duration: leave.duration,
				employee: leave.employee.id,
				leave_type: leave.leave_type.id,
				reason: leave.reason,
				status: leave.status,
				createdAt: leave.createdAt,
				updatedAt: leave.updatedAt,
			}))

			setDataCSV(dataCSV)
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

	const columns: TColumn[] = leaveColumn({
		currentUser,
		onRejected: (id: number) => {
			setIsloading(true)
			mutateUpdateStatus({
				status: 'Rejected',
				leaveId: id,
			})
		},
		onApproved: (id: number) => {
			setIsloading(true)
			mutateUpdateStatus({
				status: 'Approved',
				leaveId: id,
			})
		},
		onDelete: (id: number) => {
			setLeaveId(id)
			onOpenDl()
		},
		onDetail: (id: number) => {
			setLeaveId(id)
			onOpenDetail()
		},
		onUpdate: (id: number) => {
			setLeaveId(id)
			onOpenUpdate()
		},
	})

	return (
		<Box pb={8}>
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
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<Func
								icon={<IoAdd />}
								description={'Add new client by form'}
								title={'Add new'}
								action={onOpenAdd}
							/>
							<CSVLink filename={'leaves.csv'} headers={headersCSV} data={dataCSV}>
								<Func
									icon={<BiExport />}
									description={'export to csv'}
									title={'export'}
									action={() => {}}
								/>
							</CSVLink>
							<Func
								icon={<AiOutlineDelete />}
								title={'Delete all'}
								description={'Delete all client you selected'}
								action={onOpenDlMany}
								disabled={!dataSl || dataSl.length == 0 ? true : false}
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
						icon={<MdOutlineEvent />}
						title={'Calendar'}
						description={'show tasks as calendar'}
						action={() => {
							router.push('/leaves/calendar')
						}}
					/>
				</SimpleGrid>
			</Collapse>
			<br />

			{currentUser && (
				<Table
					data={allLeaves?.leaves || []}
					columns={columns}
					isLoading={isLoading}
					isSelect={currentUser.role == 'Admin'}
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

			{/* drawer to add leave */}
			<Drawer size="xl" title="Add leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				{currentUser?.role === 'Admin' ? (
					<AddLeave onCloseDrawer={onCloseAdd} />
				) : currentUser?.role === 'Employee' ? (
					<AddCurrentLeave onCloseDrawer={onCloseAdd} />
				) : (
					<></>
				)}
			</Drawer>

			{/* drawer to update leave */}
			<Drawer size="xl" title="Update leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeave onCloseDrawer={onCloseUpdate} leaveId={leaveId} />
			</Drawer>

			{/* drawer to detail leave */}
			<Drawer size="md" title="Detail leave" onClose={onCloseDetail} isOpen={isOpenDetail}>
				<DetailLeave leaveId={leaveId} />
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
						options={dataStatusLeave}
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
					{currentUser && currentUser.role === 'Admin' && (
						<SelectUser
							handleSearch={(data: IFilter) => {
								setFilter(data)
							}}
							columnId={'id'}
							required={false}
							label={'User'}
							peoples={dataUsersSl}
						/>
					)}
				</VStack>
			</Drawer>
		</Box>
	)
}

Leaves.getLayout = ClientLayout

export default Leaves
