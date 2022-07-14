import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { EmployeeLayout } from 'components/layouts/Employee'
import { AuthContext } from 'contexts/AuthContext'
import { deleteLeaveMutation, deleteLeavesMutation, updateStatusMutation } from 'mutations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allLeaveQuery, allLeaveTypesQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { VscFilter } from 'react-icons/vsc'
import UpdateLeaves from 'src/pages/leaves/update-leaves'
import DetailLeave from 'src/pages/leaves/[leaveId]'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { employeeLeavesColumn } from 'utils/columns'

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

	//State ---------------------------------------------------------------------
	// set loading table
	const [isLoading, setIsLoading] = useState(true)

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
	const [mutateUpdateStatus, { status: statusUpStatus, data: dataUpdate }] =
		updateStatusMutation(setToast)

	// delete leave
	const [mutateDeleteLeave, { status: statusDl, data: dataDl }] = deleteLeaveMutation(setToast)

	// delete all leaves
	const [mutateDeleteLeaves, { status: statusDlMany, data: dataDlMany }] = deleteLeavesMutation(setToast)

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
			refetchAllLeaves()
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
			refetchAllLeaves()
		}
	}, [statusDlMany])

	// set loading == false when get all leaves successfully
	useEffect(() => {
		if (allLeaves && allLeaves.leaves) {
			setIsLoading(false)
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
		if (statusUpStatus == 'success' && dataUpdate) {
			setToast({
				type: statusUpStatus,
				msg: dataUpdate.message,
			})
			refetchAllLeaves()
			setIsLoading(false)
		}
	}, [statusUpStatus])

	useEffect(() => {
		if (isOpenUpdate == false) {
			refetchAllLeaves()
		}
	}, [isOpenUpdate])

	// header ----------------------------------------
	const columns: TColumn[] = employeeLeavesColumn({
		currentUser,
		onApproved: (id: number) => {
			setIsLoading(true)
			mutateUpdateStatus({
				status: 'Approved',
				leaveId: id,
			})
		},
		onRejected: (id: number) => {
			setIsLoading(true)
			mutateUpdateStatus({
				status: 'Rejected',
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
			<Head>
				<title>Huprom - Leaves of employee {employeeId}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				<Func
					icon={<VscFilter />}
					description={'Open draw to filter'}
					title={'filter'}
					action={onOpenFilter}
				/>
				<Func
					icon={<AiOutlineDelete />}
					title={'Delete all'}
					description={'Delete all leaves you selected'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
				/>
			</FuncCollapse>

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
					setIsLoading(true)
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
						setIsLoading(true)
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
