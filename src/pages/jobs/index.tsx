import {
	Box,
	Button,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allJobsQuery } from 'queries/job'
import { useContext, useEffect, useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dataJobStatus } from 'utils/basicData'
import AddJob from './add-jobs'
import UpdateJob from './[jobId]/update'
import { deleteJobMutation, deleteJobsMutation, updateJobStatusMutation } from 'mutations/job'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { DateRange, Input, Select as FSelect } from 'components/filter'
import { jobColumn } from 'utils/columns'

const Job: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	// state
	const [idJob, setIdJob] = useState<number | null>(null)
	// set loading table
	const [isLoading, setIsLoading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	//Setup drawer --------------------------------------------------------------
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

	//Query ---------------------------------------------------------------------
	const { data: dataAllJobs, mutate: refetchAllJobs } = allJobsQuery()

	// mutate
	const [deleteOne, { status: statusDlOne, data: dataDlOne }] = deleteJobMutation(setToast)
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] = deleteJobsMutation(setToast)
	const [updateStatus, { status: statusUpdate, data: dataUpdate }] =
		updateJobStatusMutation(setToast)

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
		if (dataAllJobs) {
			setIsLoading(false)
		}
	}, [dataAllJobs])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: statusDlOne,
				msg: dataDlOne.message,
			})
			refetchAllJobs()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdate) {
			setToast({
				type: statusUpdate,
				msg: dataUpdate.message,
			})
			refetchAllJobs()
		}
	}, [statusUpdate])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			setDataSl([])
			refetchAllJobs()
		}
	}, [statusDlMany])

	const columns: TColumn[] = jobColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdJob(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setIdJob(id)
			onOpenUpdate()
		},
		onChangeStatus: async (id: number, event: any) => {
			setIsLoading(true)
			await updateStatus({
				id,
				status: event.target.value == 'Open' ? true : false,
			})
		},
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Jobs</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new job by form'}
							title={'Add new'}
							action={onOpenAdd}
						/>

						<Func
							icon={<AiOutlineDelete />}
							title={'Delete all'}
							description={'Delete all jobs you selected'}
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
				data={dataAllJobs?.jobs || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role == 'Admin'}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>
			<Drawer size="xl" title="Add Jobs" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddJob onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Jobs" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateJob onCloseDrawer={onCloseUpdate} JobIdProp={idJob} />
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					deleteOne(String(idJob))
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
						deleteMany({
							jobs: dataSl,
						})
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>
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
						columnId={'title'}
						label="Title"
						placeholder="Enter title"
						required={false}
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<FSelect
						options={dataJobStatus}
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
								columnId: 'starts_on_date',
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
Job.getLayout = ClientLayout

export default Job
