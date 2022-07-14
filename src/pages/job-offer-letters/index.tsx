import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Select as FSelect } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import {
	deleteJobOfferLetterMutation,
	deleteJobOfferLettersMutation,
} from 'mutations/jobOfferLetter'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allJobsQuery } from 'queries/job'
import { allJobOffersQuery } from 'queries/jobOfferLetter'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dataJobOfferStatus } from 'utils/basicData'
import { offerLettersColumn } from 'utils/columns'
import AddOfferLetter from './add-job-offer-letters'
import UpdateOfferLetter from './[jobOfferLetterId]/update'

const Job: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	// state
	const [idOffer, setIdOffer] = useState<number | null>(null)
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
	const { data: dataOfferLetters, mutate: refetchOfferLetters } =
		allJobOffersQuery(isAuthenticated)

	const { data: dataJobs } = allJobsQuery()

	// mutate
	const [deleteOne, { status: statusDlOne, data: dataDlOne }] =
		deleteJobOfferLetterMutation(setToast)
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] =
		deleteJobOfferLettersMutation(setToast)

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
		if (dataOfferLetters) {
			console.log(dataOfferLetters)
			setIsLoading(false)
		}
	}, [dataOfferLetters])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: statusDlOne,
				msg: dataDlOne.message,
			})
			refetchOfferLetters()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			setDataSl([])
			refetchOfferLetters()
		}
	}, [statusDlMany])

	const columns: TColumn[] = offerLettersColumn({
		currentUser,
		onUpdate: (id: number) => {
			setIdOffer(id)
			onOpenUpdate()
		},
		onDelete: (id: number) => {
			setIdOffer(id)
			onOpenDl()
		},
	})

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Offer letters</title>
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
				data={dataOfferLetters?.jobOfferLetters || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role == 'Admin'}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>
			<Drawer size="xl" title="Add Job Offer Letter" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddOfferLetter onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer
				size="xl"
				title="Update Job Offer Letter"
				onClose={onCloseUpdate}
				isOpen={isOpenUpdate}
			>
				<UpdateOfferLetter onCloseDrawer={onCloseUpdate} jobOfferLetterId={idOffer} />
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					deleteOne(String(idOffer))
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
							jobOfferLetters: dataSl,
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
					<FSelect
						options={dataJobs?.jobs?.map((job) => ({
							label: job.title,
							value: job.id,
						}))}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'job'}
						label="Job"
						placeholder="Select job"
						required={false}
					/>
					<FSelect
						options={dataJobOfferStatus}
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
								columnId: 'exprise_on',
								filterValue: date,
							})
						}}
						label="Select expire on"
					/>
					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'expected_joining_date',
								filterValue: date,
							})
						}}
						label="Select expected joining"
					/>
				</VStack>
			</Drawer>
		</Box>
	)
}
Job.getLayout = ClientLayout

export default Job
