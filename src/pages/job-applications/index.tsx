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
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select as FSelect } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import {
	deleteJobApplicationMutation,
	deleteJobApplicationsMutation,
	updateJobApplicationStatusMutation,
} from 'mutations/jobApplication'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allJobsQuery } from 'queries/job'
import { allJobApplicationsQuery } from 'queries/jobApplication'
import { allLocationsQuery } from 'queries/location'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dataJobApplicationStatus } from 'utils/basicData'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddJobApplications from './add-job-applications'
import DetailJobApplication from './[jobApplicationId]'
import UpdateJobApplication from './[jobApplicationId]/update'
// import UpdateJob from './[jobId]/update'

const jobApplications: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	// state
	const [idJobApplication, setIdJobApplication] = useState<number | null>(null)
	// set loading table
	const [isLoading, setIsloading] = useState(true)

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
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

	//Query ---------------------------------------------------------------------
	const { data: dataAllJobApplications, mutate: refetchAllData } =
		allJobApplicationsQuery(isAuthenticated)

	const { data: dataAllLocations } = allLocationsQuery(isAuthenticated)
	const { data: dataAllJobs } = allJobsQuery(isAuthenticated)

	// mutate
	const [updateStatus, { status: statusUpdate, data: dataUpdate }] =
		updateJobApplicationStatusMutation(setToast)
	const [deleteOne, { status: statusDlOne, data: dataDlOne }] =
		deleteJobApplicationMutation(setToast)
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] =
		deleteJobApplicationsMutation(setToast)

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
		if (statusUpdate == 'success' && dataUpdate) {
			setToast({
				type: statusUpdate,
				msg: dataUpdate.message,
			})
			refetchAllData()
		}
	}, [statusUpdate])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: statusDlOne,
				msg: dataDlOne.message,
			})
			refetchAllData()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			setDataSl([])
			refetchAllData()
		}
	}, [statusDlMany])

	useEffect(() => {
		if (dataAllJobApplications) {
			setIsloading(false)
		}
	}, [dataAllJobApplications])

	const columns: TColumn[] = [
		{
			Header: 'Job applications',
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
					Header: 'Name',
					accessor: 'name',
					filter: textFilter(['title']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Job',
					accessor: 'jobs',
					filter: textFilter(['jobs', 'id']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.title}</Text>
					},
				},
				{
					Header: 'Location',
					accessor: 'location',
					filter: selectFilter(['location', 'name']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value.name}</Text>
					},
				},
				{
					Header: 'Date',
					accessor: 'createdAt',
					filter: dateFilter(['createdAt']),
					minWidth: 80,
					Cell: ({ value }) => {
						return (
							<Text isTruncated>{new Date(value).toLocaleDateString('es-CL')}</Text>
						)
					},
				},
				{
					Header: 'Status',
					accessor: 'status',
					filter: selectFilter(['status']),

					minWidth: 160,
					Cell: ({ value, row }) => {
						return (
							<Select
								onChange={async (event) => {
									setIsloading(true)
									await updateStatus({
										id: row.values['id'],
										status: event.target.value,
									})
								}}
								defaultValue={value}
							>
								{dataJobApplicationStatus.map((e) => (
									<option value={e.value}>{e.label}</option>
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
										setIdJobApplication(row.values['id'])
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
												setIdJobApplication(row.values['id'])
												onOpenUpdate()
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												setIdJobApplication(row.values['id'])
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
				data={dataAllJobApplications?.jobApplications || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role == 'Admin'}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>
			<Drawer size="xl" title="Add Job Application" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddJobApplications onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Jobs" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateJobApplication
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
					setIsloading(true)
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
						setIsloading(true)
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
jobApplications.getLayout = ClientLayout

export default jobApplications
