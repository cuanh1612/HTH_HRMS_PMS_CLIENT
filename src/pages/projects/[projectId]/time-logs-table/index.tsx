import {
	Avatar,
	Badge,
	Button,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
	Drawer as CDrawer,
	DrawerHeader,
} from '@chakra-ui/react'
import { AlertDialog, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { ClientLayout, ProjectLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteTimeLogMutation, deleteTimeLogsMutation } from 'mutations'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allStatusQuery, timeLogsByProjectQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { projectMutaionResponse } from 'type/mutationResponses'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddTimeLog from './add-time-logs'
import DetailTimeLog from './[timeLogId]'
import UpdateTimeLog from './[timeLogId]/update-time-logs'

const TimeLogs: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	const { projectId } = router.query

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

	//Modal -------------------------------------------------------------
	// set open add time log
	const {
		isOpen: isOpenAddTimeLog,
		onOpen: onOpenAddTimeLog,
		onClose: onCloseAddTimeLog,
	} = useDisclosure()

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

	// mutation

	// delete one
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteTimeLogMutation(setToast)

	// delete may
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] =
		deleteTimeLogsMutation(setToast)

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	// get all time log by project
	const { data: allTimeLogs, mutate: refetchTimeLogs } = timeLogsByProjectQuery(
		isAuthenticated,
		projectId
	)

	// get all status to filter
	const { data: allStatuses } = allStatusQuery(
		isAuthenticated,
		projectId
	)

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
		}
	}, [statusDlMany])

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
										setIdTimeLog(Number(row.values['id']))
										onOpenDetailTimelog()
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
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
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	return (
		<>
			<Button onClick={onOpenAddTimeLog}>Add new</Button>
			<Button disabled={!dataSl || dataSl.length == 0 ? true : false} onClick={onOpenDlMany}>
				Delete all
			</Button>
			<Button onClick={onOpenFilter}>filter</Button>
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
			<Table
				data={allTimeLogs?.timeLogs || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				disableColumns={['status']}
				isResetFilter={isResetFilter}
			/>

			{/* drawer to add project time log */}
			<Drawer
				size="xl"
				title="Add Time Log"
				onClose={onCloseAddTimeLog}
				isOpen={isOpenAddTimeLog}
			>
				<AddTimeLog onCloseDrawer={onCloseAddTimeLog} />
			</Drawer>

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
								columnId={'task'}
								label="Task"
								placeholder="Enter task title"
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
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
								options={allStatuses?.statuses?.map((item) => ({
									label: item.title,
									value: item.id,
								}))}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'status'}
								label="Status"
								placeholder="Select status"
							/>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	//Get accesstoken
	const getAccessToken: { accessToken: string; code: number; message: string; success: boolean } =
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh_token`, {
			method: 'GET',
			headers: {
				cookie: context.req.headers.cookie,
			} as HeadersInit,
		}).then((e) => e.json())

	//Redirect login page when error
	if (getAccessToken.code !== 200) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}

	//Check assigned
	const checkAsignedProject: projectMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-asigned`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!checkAsignedProject.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {},
	}
}

TimeLogs.getLayout = ProjectLayout

export default TimeLogs
