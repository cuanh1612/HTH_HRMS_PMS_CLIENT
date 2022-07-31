import {
	Avatar,
	Box,
	Button,
	HStack,
	Text,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, SelectCustom, Select as FSelect } from 'components/filter'
import { JobLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import {
	deleteInterviewMutation,
	deleteInterviewsMutation,
	updateInterviewStatusMutation,
} from 'mutations/interview'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allEmployeesNormalQuery } from 'queries'
import { interviewsByJobQuery } from 'queries/interview'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { MdOutlineEvent } from 'react-icons/md'
import { VscFilter } from 'react-icons/vsc'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import DetailInterview from 'src/pages/interviews/[interviewId]'
import UpdateInterview from 'src/pages/interviews/[interviewId]/update'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dataInterviewStatus } from 'utils/basicData'
import { jobInterviewColumn } from 'utils/columns'
import AddInterviews from '../../interviews/add-interviews'

export interface ICandidateProps {
	jobIdProp: string | number | null
}

const Interview: NextLayout | any = ({ jobIdProp }: ICandidateProps) => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query
	const { colorMode } = useColorMode()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})
	// set loading table
	const [isLoading, setIsLoading] = useState(true)
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

	//Query -------------------------------------------------------------
	const { data: dataInterviews, mutate: refreshInterviews } = interviewsByJobQuery(
		isAuthenticated,
		jobIdProp || (jobIdRouter as string)
	)
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// mutate
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteInterviewMutation(setToast)
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] =
		deleteInterviewsMutation(setToast)
	const [updateStatus, { data: dataUpdateStatus, status: statusUpdate }] =
		updateInterviewStatusMutation(setToast)

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
		if (dataInterviews) {
			setIsLoading(false)
		}
	}, [dataInterviews])

	// check is successfully delete one
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				msg: dataDlOne.message,
				type: statusDlOne,
			})
			refreshInterviews()
			setIsLoading(false)
		}
	}, [statusDlOne])

	// check is successfully update status
	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdateStatus) {
			setToast({
				msg: dataUpdateStatus.message,
				type: statusUpdate,
			})
			refreshInterviews()
			setIsLoading(false)
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
			refreshInterviews()
			setIsLoading(false)
		}
	}, [statusDlMany])

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

	const columns: TColumn[] = jobInterviewColumn({
		currentUser,
		onChangeStatus: async (id: number, event: any) => {
			setIsLoading(true)
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
				<title>Huprom - Job interviews</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<Func
						icon={<IoAdd />}
						description={'Add new interview schedule by form'}
						title={'Add new'}
						action={onOpenAdd}
					/>
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
			</FuncCollapse>
			<Table
				data={dataInterviews?.interviews || []}
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
					setIsLoading(true)
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
						setIsLoading(true)
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
				<AddInterviews onUpdateInterview={refreshInterviews} onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer
				size="xl"
				title="Update Interview"
				onClose={onCloseUpdate}
				isOpen={isOpenUpdate}
			>
				<UpdateInterview
					onUpdateInterview={refreshInterviews}
					onCloseDrawer={onCloseUpdate}
					interviewId={interviewId}
				/>
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
							setFilter(data)
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

Interview.getLayout = JobLayout
export default Interview
