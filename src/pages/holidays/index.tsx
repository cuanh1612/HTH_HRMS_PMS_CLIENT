import {
	Button, Drawer as CDrawer, DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react'
import { AlertDialog, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, Select } from 'components/filter'
import ImportCSV from 'components/importCSV'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { createHolidaysMutation, deleteHolidayMutation, deleteHolidaysMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allHolidaysQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaFileCsv } from 'react-icons/fa'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { monthFilter, textFilter, yearFilter } from 'utils/tableFilters'
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

	const [holidayIdUpdate, setHolidayIdUpdate] = useState<number | null>(1)
	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// get id to delete employee
	const [idDlHoliday, setIdDlHoliday] = useState<number>()

	// get all holidays
	const { data: allHolidays, mutate: refetchAllHolidays } = allHolidaysQuery()
	console.log(allHolidays)

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// mutation
	// delete holidays
	const [mutateDeleteHolidays, { status: statusDlHolidays }] = deleteHolidaysMutation(setToast)

	// delete holiday
	const [mutateDeleteHoliday, { status: statusDl }] = deleteHolidayMutation(setToast)

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
		if (statusDlHolidays == 'success') {
			setToast({
				msg: 'Delete employees successfully',
				type: 'success',
			})
			setDataSl(null)
			refetchAllHolidays()
		}
	}, [statusDlHolidays])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success') {
			setToast({
				msg: 'Delete employee successfully',
				type: 'success',
			})
			refetchAllHolidays()
		}
	}, [statusDl])

	//Note when request success
	useEffect(() => {
		if (statusCreHolidays === 'success') {
			//Close drawer when using drawer
			setToast({
				type: 'success',
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
	const columns: TColumn[] = [
		{
			Header: 'Holidays',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
				},
				{
					Header: 'Date',
					filter: yearFilter(['holiday_date']),
					accessor: 'holiday_date',
					minWidth: 150,
					width: 150,
					Cell: ({ value }) => {
						const date = new Date(value)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'Occasion',
					filter: textFilter(['occasion']),
					accessor: 'occasion',
					minWidth: 250,
					width: 500,
				},
				{
					Header: 'Day',
					filter: monthFilter(['holiday_date']),
					accessor: 'day',
					minWidth: 150,
					width: 150,
					Cell: ({ row }) => {
						let daysArray = [
							'Sunday',
							'Monday',
							'Tuesday',
							'Wednesday',
							'Thursday',
							'Friday',
							'Saturday',
						]
						const date = new Date(row.values['holiday_date']).getDay()
						return <Text>{daysArray[date]}</Text>
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
										setHolidayIdDetail(row.values['id'])
										onOpenDetail()
									}}
									icon={<IoEyeOutline fontSize={'15px'} />}
								>
									View
								</MenuItem>
								{currentUser && currentUser.role === 'Admin' && (
									<>
										<MenuItem
											onClick={() => {
												setHolidayIdUpdate(row.values['id'])
												onOpenUpdate()
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>
										<MenuItem
											onClick={() => {
												setIdDlHoliday(row.values['id'])
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

	// set loading == false when get all holidays successfully
	useEffect(() => {
		if (allHolidays) {
			setIsloading(false)

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
		<>
			{currentUser && currentUser.role === 'Admin' && (
				<>
					<Button colorScheme="blue" onClick={onOpenAdd}>
						add new
					</Button>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<Button
								transform={'auto'}
								bg={'hu-Green.lightA'}
								_hover={{
									bg: 'hu-Green.normal',
									color: 'white',
									scale: 1.05,
								}}
								color={'hu-Green.normal'}
								leftIcon={<FaFileCsv />}
							>
								<CSVLink
									filename={'holidays.csv'}
									headers={headersCSV}
									data={dataCSV}
								>
									export to csv
								</CSVLink>
							</Button>

							<Button
								transform={'auto'}
								bg={'hu-Green.lightA'}
								_hover={{
									bg: 'hu-Green.normal',
									color: 'white',
									scale: 1.05,
								}}
								color={'hu-Green.normal'}
								leftIcon={<FaFileCsv />}
							>
								<CSVLink
									filename={'holidaysTemplate.csv'}
									headers={headersCSVTemplate}
									data={dataCSVTemplate}
								>
									Download csv template
								</CSVLink>
							</Button>

							<ImportCSV
								fieldsValid={['holiday_date', 'occasion']}
								handleImportCSV={handleImportCSV}
								statusImport={statusCreHolidays === 'running'}
								isOpenImportCSV={isOpenImportCSV}
								onCloseImportCSV={onCloseImportCSV}
								onOpenImportCSV={onOpenImportCSV}
							/>
						</>
					)}
					<Button
						disabled={!dataSl || dataSl.length == 0 ? true : false}
						onClick={onOpenDlMany}
					>
						Delete all
					</Button>
				</>
			)}
			<Button
				onClick={() => {
					onOpenFilter()
				}}
			>
				Filter
			</Button>
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
				data={allHolidays?.holidays || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>

			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsloading(true)
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
					setIsloading(true)
					mutateDeleteHoliday(String(idDlHoliday))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
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
								columnId={'occasion'}
								label="Occasion"
								placeholder="Enter occasion"
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
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
					</DrawerBody>
				</DrawerContent>
			</CDrawer>

			<Drawer size="xl" title="Add Holiday" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddHoliday onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Holiday" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateHoliday onCloseDrawer={onCloseUpdate} holidayId={holidayIdUpdate} />
			</Drawer>
			<Drawer
				size="xl"
				title="Detail Holiday"
				onClose={handleCloseDetailHoliday}
				isOpen={isOpenDetail}
			>
				<DetailHoliday
					holidayIdProp={holidayIdDetail}
					onCloseDrawer={handleCloseDetailHoliday}
				/>
			</Drawer>
		</>
	)
}
Holiday.getLayout = ClientLayout

export default Holiday
