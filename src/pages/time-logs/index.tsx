import {
	Button, Drawer as CDrawer, DrawerBody,
	DrawerCloseButton,
	DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure,
	VStack
} from '@chakra-ui/react'
import { AlertDialog } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { AuthContext } from 'contexts/AuthContext'
import { deleteTimeLogMutation, deleteTimeLogsMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allStatusQuery, timeLogsByProjectQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { NextLayout } from 'type/element/layout'
import { IFilter } from 'type/tableTypes'
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
	const [idTimeLog, setIdTimeLog] = useState<number>(16)

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

	return (
		<>
			<Button onClick={onOpenAddTimeLog}>Add new</Button>
			<Button onClick={onOpenUpdateTimelog}>Update time log</Button>
			<Button onClick={onOpenDetailTimelog}>detail time log</Button>
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

export default TimeLogs
