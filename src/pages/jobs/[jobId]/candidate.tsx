import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select as FSelect } from 'components/filter'
import { JobLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import {
	deleteJobApplicationMutation,
	deleteJobApplicationsMutation,
	updateJobApplicationStatusMutation,
} from 'mutations/jobApplication'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allJobsQuery, detailJobQuery } from 'queries/job'
import { applicationsByJobQuery } from 'queries/jobApplication'
import { allLocationsQuery } from 'queries/location'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import AddJobApplication from 'src/pages/job-applications/add-job-applications'
import DetailJobApplication from 'src/pages/job-applications/[jobApplicationId]'
import UpdateJobApplication from 'src/pages/job-applications/[jobApplicationId]/update'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dataJobApplicationStatus } from 'utils/basicData'
import { candidateColumn } from 'utils/columns'

export interface ICandidateProps {
	jobIdProp: string | number | null
}

const Candidate: NextLayout | any = ({ jobIdProp }: ICandidateProps) => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query

	// set loading table
	const [isLoading, setIsLoading] = useState(true)
	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()
	const [idJobApplication, setIdJobApplication] = useState<number | null>(null)

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataApplications, mutate: refetchApplications } = applicationsByJobQuery(
		isAuthenticated,
		jobIdProp || (jobIdRouter as string)
	)
	const { data: dataAllLocations } = allLocationsQuery(isAuthenticated)
	const { data: dataAllJobs } = allJobsQuery()

	const { data: detailJob } = detailJobQuery(jobIdProp || (jobIdRouter as string))

	// mutate
	const [updateStatus, { status: statusUpdate, data: dataUpdate }] =
		updateJobApplicationStatusMutation(setToast)
	const [deleteOne, { status: statusDlOne, data: dataDlOne }] =
		deleteJobApplicationMutation(setToast)
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] =
		deleteJobApplicationsMutation(setToast)

	//User effect ---------------------------------------------------------------
	//Handle check logged in
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
		if (dataApplications) {
			setIsLoading(false)
		}
	}, [dataApplications])

	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdate) {
			setToast({
				type: statusUpdate,
				msg: dataUpdate.message,
			})
			refetchApplications()
		}
	}, [statusUpdate])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: statusDlOne,
				msg: dataDlOne.message,
			})
			refetchApplications()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			setDataSl([])
			refetchApplications()
		}
	}, [statusDlMany])

	const columns: TColumn[] = candidateColumn({
		currentUser,
		onChangeStatus: async (id: number, event: any) => {
			setIsLoading(true)
			await updateStatus({
				id,
				status: event.target.value,
			})
		},
		onDelete: (id: number) => {
			setIdJobApplication(id)
			onOpenDl()
		},
		onDetail: (id: number) => {
			setIdJobApplication(id)
			onOpenDetail()
		},
		onUpdate: (id: number) => {
			setIdJobApplication(id)
			onOpenUpdate()
		},
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Job candidates</title>
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
				data={dataApplications?.jobApplications || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role == 'Admin'}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>

			<Drawer size="xl" title="Add Application" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddJobApplication
					onUpdateCandidates={refetchApplications}
					dataJob={detailJob}
					onCloseDrawer={onCloseAdd}
				/>
			</Drawer>

			<Drawer size="xl" title="Update Jobs" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateJobApplication
					onUpdateCandidates={refetchApplications}
					onCloseDrawer={onCloseUpdate}
					jobApplicationId={idJobApplication}
				/>
			</Drawer>
			<Drawer
				size="xl"
				title="Detail Jobs Application"
				onClose={onCloseDetail}
				isOpen={isOpenDetail}
			>
				<DetailJobApplication
					onCloseDrawer={onCloseDetail}
					jobApplicationId={idJobApplication}
				/>
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					deleteOne(String(idJobApplication))
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
							jobApplications: dataSl,
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
						columnId={'name'}
						label="Name"
						placeholder="Enter name"
						required={false}
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<FSelect
						options={dataJobApplicationStatus}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'status'}
						label="Status"
						placeholder="Select status"
						required={false}
					/>

					<FSelect
						options={dataAllLocations?.locations?.map((e) => {
							return {
								label: e.name,
								value: e.name,
							}
						})}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'location'}
						label="Location"
						placeholder="Select location"
						required={false}
					/>

					<FSelect
						options={dataAllJobs?.jobs?.map((e) => {
							return {
								label: e.title,
								value: e.id,
							}
						})}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'jobs'}
						label="Job"
						placeholder="Select job"
						required={false}
					/>

					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'createdAt',
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

Candidate.getLayout = JobLayout

export default Candidate
