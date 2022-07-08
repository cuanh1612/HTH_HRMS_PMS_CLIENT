import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
// import { allJobsQuery } from 'queries/job'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import AddInterviews from './add-interviews'
import DetailInterview from './[interviewId]'
import UpdateInterview from './[interviewId]/update'
import { allInterviewsQuery } from 'queries/interview'
import { IFilter, TColumn } from 'type/tableTypes'
import { selectFilter, textFilter } from 'utils/tableFilters'
import { dataInterviewStatus } from 'utils/basicData'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { deleteInterviewMutation } from 'mutations/interview'
// import UpdateJob from './[jobId]/update'

const interviews: NextLayout = () => {
	const { currentUser, isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

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

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

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
	const { data: allInterviewSchedule } = allInterviewsQuery(isAuthenticated)

	// mutate
	const [deleteOne, {}] = deleteInterviewMutation(setToast)

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

	useEffect(() => {
		if (allInterviewSchedule) {
			console.log(allInterviewSchedule)
			setIsloading(false)
		}
	}, [allInterviewSchedule])

	const columns: TColumn[] = [
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
					filter: textFilter(['date']),
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
									// await onChangeStatus(row.values['id'], event)
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
										setInterviewId(row.values['id'])
										onOpenDetail()
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>

								{currentUser?.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												setInterviewId(row.values['id'])
												onOpenUpdate()
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												setInterviewId(row.values['id'])
												// onDelete(row.values['id'])
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
				{/* <Func
					icon={<VscFilter />}
					description={'Open draw to filter'}
					title={'filter'}
					action={onOpenFilter}
				/> */}
				{/* <Func
					icon={<AiOutlineDelete />}
					title={'Delete all'}
					description={'Delete all employees you selected'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
				/> */}
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
					// mutateDeleteEmpl(String(employeeId))
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
						// mutateDeleteEmpls(dataSl)
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
		</Box>
	)
}
interviews.getLayout = ClientLayout

export default interviews
