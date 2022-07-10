import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select,
	Text,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
// import { allJobsQuery } from 'queries/job'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import AddInterviews from './add-interviews'
import DetailInterview from './[interviewId]'
import UpdateInterview from './[interviewId]/update'
import { allInterviewsQuery } from 'queries/interview'
import { IFilter, TColumn } from 'type/tableTypes'
import { arrayFilter, dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import { dataInterviewStatus } from 'utils/basicData'
import { MdOutlineDeleteOutline, MdOutlineEvent, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import {
	deleteInterviewMutation,
	deleteInterviewsMutation,
	updateInterviewStatusMutation,
} from 'mutations/interview'
import { DateRange, Input, Select as FSelect, SelectCustom } from 'components/filter'
import { employeeType, IOption } from 'type/basicTypes'
import { allEmployeesNormalQuery } from 'queries'
import { interviewScheduleColumn } from 'utils/columns'
// import UpdateJob from './[jobId]/update'

const interviews: NextLayout = () => {
	const { currentUser, isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})
	// set loading table
	const [isLoading, setIsloading] = useState(true)
	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()
	// is reset table
	const [isResetFilter, setIsReset] = useState(false)
	const [interviewId, setInterviewId] = useState<number | null>(null)
	// get employee to select to filter
	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
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

	//Query ---------------------------------------------------------------------
	// const { data: dataAllJobs } = allJobsQuery(isAuthenticated)
	const { data: allInterviewSchedule, mutate: refetchAllInterview } =
		allInterviewsQuery(isAuthenticated)
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// mutate
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteInterviewMutation(setToast)
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] =
		deleteInterviewsMutation(setToast)
	const [updateStatus, { data: dataUpdateStatus, status: statusUpdate }] =
		updateInterviewStatusMutation(setToast)

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

	// check is successfully delete one
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				msg: dataDlOne.message,
				type: statusDlOne,
			})
			refetchAllInterview()
			setIsloading(false)
		}
	}, [statusDlOne])

	// check is successfully update status
	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdateStatus) {
			setToast({
				msg: dataUpdateStatus.message,
				type: statusUpdate,
			})
			refetchAllInterview()
			setIsloading(false)
		}
	}, [statusUpdate])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: 'success',
			})
			setDataSl(null)
			refetchAllInterview()
			setIsloading(false)
		}
	}, [statusDlMany])

	useEffect(() => {
		if (allInterviewSchedule) {
			console.log(allInterviewSchedule)
			setIsloading(false)
		}
	}, [allInterviewSchedule])

	// set employee to filter
	useEffect(() => {
		if (allEmployees?.employees) {
			const valuesFilter = allEmployees.employees.map(
				(employee): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{employee.name}
								</Text>
							</HStack>
						</>
					),
					value: String(employee.id),
				})
			)
			setEmployeesFilter(valuesFilter)
		}
	}, [allEmployees, colorMode])

	const columns: TColumn[] = interviewScheduleColumn({
		currentUser,
		onChangeStatus: async (id: number, event: any) => {
			setIsloading(true)
			await updateStatus({
				id,
				status: event.target.value,
			})
		},
		onDelete: (id: number) => {
			setInterviewId(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setInterviewId(id)
			onOpenUpdate()
		},
		onDetail: (id: number) => {
			setInterviewId(id)
			onOpenDetail()
		},
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Interview schedule</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new interview schedule by form'}
							title={'Add new'}
							action={onOpenAdd}
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
					description={'Delete all interview schedules'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
				/>
				<Func
					icon={<MdOutlineEvent />}
					title={'Calendar'}
					description={'show interview schedule as calendar'}
					action={() => {
						router.push('/interviews/calendar')
					}}
				/>
			</FuncCollapse>

			<Table
				data={allInterviewSchedule?.interviews || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>
			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteOne(interviewId)
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
						deleteMany({
							interviews: dataSl,
						})
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>
			<Drawer size="xl" title="Add Interview" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddInterviews onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer
				size="xl"
				title="Update Interview"
				onClose={onCloseUpdate}
				isOpen={isOpenUpdate}
			>
				<UpdateInterview onCloseDrawer={onCloseUpdate} interviewId={interviewId} />
			</Drawer>
			<Drawer
				size="xl"
				title="Detail Interview"
				onClose={onCloseDetail}
				isOpen={isOpenDetail}
			>
				<DetailInterview onCloseDrawer={onCloseDetail} interviewId={interviewId} />
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
						columnId={'candidate'}
						label="Candidate"
						placeholder="Enter name"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<FSelect
						options={dataInterviewStatus}
						handleSearch={(data: IFilter) => {
							if (data.filterValue == 'Open') {
								setFilter({
									...data,
									filterValue: true,
								})
							} else {
								setFilter({
									...data,
									filterValue: false,
								})
							}
						}}
						columnId={'status'}
						label="Status"
						placeholder="Select status"
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
					{employeesFilter && (
						<SelectCustom
							handleSearch={(field: any) => {
								setFilter({
									columnId: 'interviewer',
									filterValue: field.value,
								})
							}}
							label={'Interviewers'}
							name={'interviewer'}
							options={[
								{
									label: (
										<Text color={colorMode == 'light' ? 'black' : 'white'}>
											all
										</Text>
									),
									value: '',
								},

								...employeesFilter,
							]}
							required={false}
						/>
					)}
				</VStack>
			</Drawer>
		</Box>
	)
}
interviews.getLayout = ClientLayout

export default interviews
