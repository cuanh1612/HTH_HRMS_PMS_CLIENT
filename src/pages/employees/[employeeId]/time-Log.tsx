
import {
	Avatar,
	Badge,
	Button,
	Collapse,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
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
import { deleteTimeLogMutation, deleteTimeLogsMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allProjectsNormalQuery, timeLogsCurrentUserQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import {
	AiOutlineCaretDown,
	AiOutlineCaretUp,
	AiOutlineDelete,
	AiOutlineSearch,
} from 'react-icons/ai'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { VscFilter } from 'react-icons/vsc'
import DetailTimeLog from 'src/pages/time-logs/[timeLogId]'
import UpdateTimeLog from 'src/pages/time-logs/[timeLogId]/update-time-logs'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'

const TimeLog: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// set id time log to delete or update
	const [idTimeLog, setIdTimeLog] = useState<number>()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'earnings', key: 'earnings' },
		{ label: 'employee', key: 'employee' },
		{ label: 'ends_on_date', key: 'ends_on_date' },
		{ label: 'ends_on_time', key: 'ends_on_time' },
		{ label: 'memo', key: 'memo' },
		{ label: 'project', key: 'project' },
		{ label: 'starts_on_date', key: 'starts_on_date' },
		{ label: 'starts_on_time', key: 'starts_on_time' },
		{ label: 'task', key: 'task' },
		{ label: 'total_hours', key: 'total_hours' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	//Modal -------------------------------------------------------------

	//set isopen of function
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: true,
	})

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set open update time log
	const {
		isOpen: isOpenUpdateTimelog,
		onOpen: onOpenUpdateTimelog,
		onClose: onCloseUpdateTimelog,
	} = useDisclosure()

	// set open detail time log
	const {
		isOpen: isOpenDetailTimelog,
		onOpen: onOpenDetailTimelog,
		onClose: onCloseDetailTimelog,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	// mutation
	// delete one
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteTimeLogMutation(setToast)

	// delete many
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] =
		deleteTimeLogsMutation(setToast)

	// query
	// get all time log by project
	const { data: allTimeLogs, mutate: refetchTimeLogs } = timeLogsCurrentUserQuery(isAuthenticated)

	// get all project to filter
	const { data: dataAllProjects } = allProjectsNormalQuery(isAuthenticated)

	//Useeffect ---------------------------------------------------------
	//Handle check login successfully
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// when get all data success
	useEffect(() => {
		if (allTimeLogs) {
			console.log(allTimeLogs)
			setIsloading(false)
		}
	}, [allTimeLogs])

	// check is successfully delete one
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				msg: dataDlOne.message,
				type: 'success',
			})
			refetchTimeLogs()
			setIsloading(false)

			if (socket) {
				socket.emit('newTimeLog')
			}
		}
	}, [statusDlOne])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: 'success',
			})
			setDataSl(null)
			refetchTimeLogs()
			setIsloading(false)

			if (socket) {
				socket.emit('newTimeLog')
			}
		}
	}, [statusDlMany])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket) {
			socket.emit('joinRoomTimeLog')

			socket.on('getNewTimeLog', () => {
				refetchTimeLogs()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket) {
				socket.emit('leaveRoomTimeLog')
			}
		}

		return leaveRoom
	}, [socket])

	useEffect(() => {
		if(isOpenUpdateTimelog == false) {
			refetchTimeLogs()
		}
	}, [isOpenUpdateTimelog])


	// header ----------------------------------------
	const columns: TColumn[] = [
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
										setIdTimeLog(Number(row.values['id']))
										onOpenDetailTimelog()
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
								{currentUser?.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												setIdTimeLog(Number(row.values['id']))
												onOpenUpdateTimelog()
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												setIdTimeLog(Number(row.values['id']))
												onOpenDl()
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

	return (
		<>
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

			<Table
				data={allTimeLogs?.timeLogs || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role === 'Admin' ? true : false}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				disableColumns={['project']}
				isResetFilter={isResetFilter}
			/>

			{/* drawer to update project time log */}
			<Drawer
				size="xl"
				title="Update Time Log"
				onClose={onCloseUpdateTimelog}
				isOpen={isOpenUpdateTimelog}
			>
				<UpdateTimeLog onCloseDrawer={onCloseUpdateTimelog} timeLogIdProp={idTimeLog} />
			</Drawer>

			{/* drawer to show detail project time log */}
			<Drawer
				size="xl"
				title="Detail Time Log"
				onClose={onCloseDetailTimelog}
				isOpen={isOpenDetailTimelog}
			>
				<DetailTimeLog timeLogIdProp={idTimeLog} />
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteOne(String(idTimeLog))
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
						deleteMany(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>
			<Drawer
				isOpen={isOpenFilter}
				size={'xs'}
				title={'filter'}
				onClose={onCloseFilter}
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
				<VStack spacing={5} p={6}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'task'}
						label="Task"
						placeholder="Enter task title"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'starts_on_date',
								filterValue: date,
							})
						}}
						label="Starts on date"
					/>

					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'ends_on_date',
								filterValue: date,
							})
						}}
						label="Ends on date"
					/>
					<Select
						options={dataAllProjects?.projects?.map((project) => ({
							label: project.name,
							value: project.id,
						}))}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'project'}
						label="Project"
						placeholder="Select project"
					/>
				</VStack>
			</Drawer>
		</>
	)
}

TimeLog.getLayout = EmployeeLayout

export default TimeLog

