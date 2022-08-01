import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { ProjectLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteTimeLogMutation, deleteTimeLogsMutation } from 'mutations'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allStatusQuery, detailProjectQuery, timeLogsByProjectQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { NextLayout } from 'type/element/layout'
import { projectMutationResponse } from 'type/mutationResponses'
import { IFilter, TColumn } from 'type/tableTypes'
import AddTimeLog from './add-time-logs'
import DetailTimeLog from './[timeLogId]'
import UpdateTimeLog from './[timeLogId]/update-time-logs'
import { CSVLink } from 'react-csv'
import { VscFilter } from 'react-icons/vsc'
import { BiExport } from 'react-icons/bi'
import { projectTimeLogsColumn } from 'utils/columns'
import Head from 'next/head'

const TimeLogs: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast, socket } =
		useContext(AuthContext)
	const router = useRouter()

	const { projectId } = router.query

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// set id time log to delete or update
	const [idTimeLog, setIdTimeLog] = useState<number>()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

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

	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId)

	// get all time log by project
	const { data: allTimeLogs, mutate: refetchTimeLogs } = timeLogsByProjectQuery(
		isAuthenticated,
		projectId
	)

	// get all status to filter
	const { data: allStatuses } = allStatusQuery(isAuthenticated, projectId)

	//UseEffect ---------------------------------------------------------
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

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && projectId) {
			socket.emit('joinRoomProjectTimeLog', projectId)

			socket.on('getNewProjectTimeLog', () => {
				refetchTimeLogs()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && projectId) {
				socket.emit('leaveRoomProjectTimeLog', projectId)
			}
		}

		return leaveRoom
	}, [socket, projectId])

	// when get all data success
	useEffect(() => {
		if (allTimeLogs) {
			console.log(allTimeLogs)
			setIsLoading(false)

			if (allTimeLogs.timeLogs) {
				//Set data csv
				const dataCSV: any[] = allTimeLogs.timeLogs.map((timeLog) => ({
					id: timeLog.id,
					earnings: timeLog.earnings,
					employee: timeLog.employee,
					ends_on_date: timeLog.ends_on_date,
					ends_on_time: timeLog.ends_on_time,
					memo: timeLog.memo,
					project: timeLog.project?.id,
					starts_on_date: timeLog.starts_on_date,
					starts_on_time: timeLog.starts_on_time,
					task: timeLog.task?.id,
					total_hours: timeLog.total_hours,
					createdAt: timeLog.createdAt,
					updatedAt: timeLog.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [allTimeLogs])

	// check is successfully delete one
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				msg: dataDlOne.message,
				type: statusDlOne,
			})
			refetchTimeLogs()
			setIsLoading(false)
			if (socket && projectId) {
				socket.emit('newProjectTimeLog', projectId)
			}
		}
	}, [statusDlOne])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: statusDlMany,
			})
			setDataSl(null)
			refetchTimeLogs()
			setIsLoading(false)
			if (socket && projectId) {
				socket.emit('newProjectTimeLog', projectId)
			}
		}
	}, [statusDlMany])

	// header ----------------------------------------
	const columns: TColumn[] = projectTimeLogsColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdTimeLog(Number(id))
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setIdTimeLog(Number(id))
			onOpenUpdateTimelog()
		},
		onDetail: (id: number) => {
			setIdTimeLog(Number(id))
			onOpenDetailTimelog()
		},
		project_Admin: dataDetailProject?.project?.project_Admin,
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Time logs of project {projectId}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{((currentUser && currentUser.role === 'Admin') ||
					(currentUser &&
						dataDetailProject?.project?.project_Admin &&
						currentUser.email === dataDetailProject.project.project_Admin.email)) && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new time log by form'}
							title={'Add new'}
							action={onOpenAddTimeLog}
						/>
						<CSVLink filename={'timelogs.csv'} headers={headersCSV} data={dataCSV}>
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
							description={'Delete all time logs you selected'}
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
			</FuncCollapse>

			<Table
				data={allTimeLogs?.timeLogs || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role == 'Admin'}
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
					setIsLoading(true)
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
						setIsLoading(true)
						deleteMany(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>
			<Drawer
				title={'Filter'}
				size={'xs'}
				isOpen={isOpenFilter}
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
				<VStack p={6} spacing={5}>
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
			</Drawer>
		</Box>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	//Get access token
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
	const checkAssignedProject: projectMutationResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-assigned`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!checkAssignedProject.success) {
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
