import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, Select } from 'components/filter'
import ImportCSV from 'components/importCSV'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { createHolidaysMutation, deleteHolidayMutation, deleteHolidaysMutation } from 'mutations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allHolidaysQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { BiExport } from 'react-icons/bi'
import { FaFileCsv } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'
import { MdOutlineEvent } from 'react-icons/md'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { holidayColumn } from 'utils/columns'
import AddHoliday from './add-holidays'
import UpdateHoliday from './update-holidays'
import DetailHoliday from './[holidayId]'

const Holiday: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
	const {
		isOpen: isOpenImportCSV,
		onOpen: onOpenImportCSV,
		onClose: onCloseImportCSV,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	//State ---------------------------------------------------------------------
	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	const [holidayIdDetail, setHolidayIdDetail] = useState<number | null>(null)

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// get id to delete employee
	const [idHoliday, setIdHoliday] = useState<number | null>(null)

	// get all holidays
	const { data: allHolidays, mutate: refetchAllHolidays } = allHolidaysQuery({})

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// mutation
	// delete holidays
	const [mutateDeleteHolidays, { status: statusDlHolidays, data: dataDlMany }] = deleteHolidaysMutation(setToast)

	// delete holiday
	const [mutateDeleteHoliday, { status: statusDl, data: dataDl }] = deleteHolidayMutation(setToast)

	const [mutateCreHolidays, { status: statusCreHolidays, data: dataCreHolidays }] =
		createHolidaysMutation(setToast)

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'holiday_date', key: 'holiday_date' },
		{ label: 'occasion', key: 'occasion' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	//Setup download csv template
	const headersCSVTemplate = [
		{ label: 'holiday_date', key: 'holiday_date' },
		{ label: 'occasion', key: 'occasion' },
	]

	const dataCSVTemplate = [{ holiday_date: '1-1-2022', occasion: 'occasion example' }]

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

	//Function -------------------------------------------------------------------
	const handleCloseDetailHoliday = () => {
		router.push('/holidays', undefined, { shallow: true })
		onCloseDetail()
	}

	useEffect(() => {
		if (holidayIdDetail) {
			window.history.pushState({}, '', `/holidays/${holidayIdDetail}`)
		}
	}, [holidayIdDetail])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlHolidays == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: statusDlHolidays,
			})
			setDataSl(null)
			refetchAllHolidays()
		}
	}, [statusDlHolidays])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDl,
			})
			refetchAllHolidays()
		}
	}, [statusDl])

	//Note when request success
	useEffect(() => {
		if (statusCreHolidays === 'success') {
			//Close drawer when using drawer
			setToast({
				type: statusCreHolidays,
				msg: dataCreHolidays?.message as string,
			})

			onCloseImportCSV()

			refetchAllHolidays()
		}
	}, [statusCreHolidays])

	// function --------------------------------------
	const handleImportCSV = (data: any) => {
		mutateCreHolidays({
			holidays: data,
		})
	}

	// header ----------------------------------------
	const columns: TColumn[] = holidayColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdHoliday(id)
			onOpenDl()
		},
		onDetail: (id: number) => {
			setHolidayIdDetail(id)
			onOpenDetail()
		},
		onUpdate: (id: number) => {
			setIdHoliday(id)
			onOpenUpdate()
		},
	})

	// set loading == false when get all holidays successfully
	useEffect(() => {
		if (allHolidays) {
			setIsLoading(false)

			if (allHolidays.holidays) {
				//Set data csv
				const dataCSV: any[] = allHolidays.holidays.map((holiday) => ({
					id: holiday.id,
					occasion: holiday.occasion,
					holiday_date: holiday.holiday_date,
					createdAt: holiday.createdAt,
					updatedAt: holiday.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [allHolidays])

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Holidays</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{currentUser && currentUser.role === 'Admin' && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new holiday by form'}
							title={'Add new'}
							action={onOpenAdd}
						/>
						<CSVLink filename={'holidays.csv'} headers={headersCSV} data={dataCSV}>
							<Func
								icon={<BiExport />}
								description={'export to csv'}
								title={'export'}
								action={() => {}}
							/>
						</CSVLink>

						<CSVLink
							filename={'holidaysTemplate.csv'}
							headers={headersCSVTemplate}
							data={dataCSVTemplate}
						>
							<Func
								icon={<FaFileCsv />}
								description={'export csv template'}
								title={'export csv template'}
								action={() => {}}
							/>
						</CSVLink>

						<ImportCSV
							fieldsValid={['holiday_date', 'occasion']}
							handleImportCSV={handleImportCSV}
							statusImport={statusCreHolidays === 'running'}
							isOpenImportCSV={isOpenImportCSV}
							onCloseImportCSV={onCloseImportCSV}
							onOpenImportCSV={onOpenImportCSV}
						/>
						<Func
							icon={<MdOutlineEvent />}
							title={'Calendar'}
							description={'show holidays as calendar'}
							action={() => {
								router.push('/holidays/calendar')
							}}
						/>
					</>
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
					description={'Delete all holiday you selected'}
					action={onOpenDlMany}
					disabled={!dataSl || dataSl.length == 0 ? true : false}
				/>
			</FuncCollapse>

			<Table
				data={allHolidays?.holidays || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role == 'Admin'}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>

			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsLoading(true)
						mutateDeleteHolidays(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					mutateDeleteHoliday(String(idHoliday))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			<Drawer
				title="Filter"
				size="xs"
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
				isOpen={isOpenFilter}
				onClose={onCloseFilter}
			>
				<VStack spacing={5} p={6}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'occasion'}
						label="Occasion"
						placeholder="Enter occasion"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					<Select
						options={[
							{
								label: 'January',
								value: 1,
							},
							{
								label: 'February',
								value: 2,
							},
							{
								label: 'March',
								value: 3,
							},
							{
								label: 'April',
								value: 4,
							},
							{
								label: 'May',
								value: 5,
							},
							{
								label: 'June',
								value: 6,
							},
							{
								label: 'July',
								value: 7,
							},
							{
								label: 'August',
								value: 8,
							},
							{
								label: 'September',
								value: 9,
							},
							{
								label: 'October',
								value: 10,
							},
							{
								label: 'November',
								value: 11,
							},
							{
								label: 'December',
								value: 12,
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'day'}
						label="Month"
						placeholder="Select month"
					/>

					<Select
						options={[
							{
								label: `${new Date().getFullYear()}`,
								value: `${new Date().getFullYear()}`,
							},
							{
								label: `${new Date().getFullYear() - 1}`,
								value: `${new Date().getFullYear() - 1}`,
							},
							{
								label: `${new Date().getFullYear() - 2}`,
								value: `${new Date().getFullYear() - 2}`,
							},
							{
								label: `${new Date().getFullYear() - 3}`,
								value: `${new Date().getFullYear() - 3}`,
							},
							{
								label: `${new Date().getFullYear() - 4}`,
								value: `${new Date().getFullYear() - 4}`,
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'holiday_date'}
						label="Year"
						placeholder="Select year"
					/>
				</VStack>
			</Drawer>

			<Drawer size="xl" title="Add Holiday" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddHoliday onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Holiday" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateHoliday onCloseDrawer={onCloseUpdate} holidayId={idHoliday} />
			</Drawer>
			<Drawer
				size="sm"
				title="Detail Holiday"
				onClose={handleCloseDetailHoliday}
				isOpen={isOpenDetail}
			>
				<DetailHoliday holidayIdProp={holidayIdDetail} />
			</Drawer>
		</Box>
	)
}
Holiday.getLayout = ClientLayout

export default Holiday
