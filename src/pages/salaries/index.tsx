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
import { Func, FuncCollapse, Head, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, SelectCustom } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allEmployeesNormalQuery, allSalariesQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import HistorySalary from './history'
import UpdateSalary from './update'
import { CSVLink } from 'react-csv'
import { BiExport } from 'react-icons/bi'
import { VscFilter } from 'react-icons/vsc'
import { IOption } from 'type/basicTypes'
import { salariesColumn } from 'utils/columns'

const Salaries: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//State -------------------------------------------------------------
	const [employeeId, setEmployeeId] = useState<string | number | null>(14)
	// set loading table
	const [isLoading, setIsLoading] = useState(true)
	// is reset table
	const [isResetFilter, setIsReset] = useState(false)
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})
	//State download csv
	const [dataCSV, setDataCSV] = useState<any[]>([])
	// get employee to select to filter
	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])

	//Modal -------------------------------------------------------------
	// set open modal to show salary history
	const {
		isOpen: isOpenHistory,
		onOpen: onOpenHistory,
		onClose: onCloseHistory,
	} = useDisclosure()

	// set open modal to show update salary
	const {
		isOpen: isOpenUpdateSalary,
		onOpen: onOpenUpdateSalary,
		onClose: onCloseUpdateSalary,
	} = useDisclosure()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataSalaries } = allSalariesQuery(isAuthenticated)
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	//UseEffect ---------------------------------------------------------
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
		if (dataSalaries) {
			setIsLoading(false)

			if (dataSalaries.salaries) {
				//Set data csv
				const dataCSV: any[] = dataSalaries.salaries.map((salary) => ({
					employeeId: salary.employeeId,
					name: salary.name,
					gender: salary.gender,
					email: salary.email,
					hourly_rate: salary.hourly_rate,
					joining_date: salary.joining_date,
					mobile: salary.mobile,
					role: salary.mobile,
					sumSalaries: salary.sumSalaries,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [dataSalaries])

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

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'employeeId', key: 'employeeId' },
		{ label: 'name', key: 'name' },
		{ label: 'gender', key: 'gender' },
		{ label: 'email', key: 'email' },
		{ label: 'hourly_rate', key: 'hourly_rate' },
		{ label: 'joining_date', key: 'joining_date' },
		{ label: 'mobile', key: 'mobile' },
		{ label: 'role', key: 'role' },
		{ label: 'sumSalaries', key: 'sumSalaries' },
	]

	// header ----------------------------------------
	const columns: TColumn[] = salariesColumn({
		currentUser,
		onDetail: (id: number) => {
			setEmployeeId(id)
			onOpenHistory()
		},
		onUpdate: (id: number) => {
			setEmployeeId(id)
			onOpenUpdateSalary()
		},
	})

	return (
		<Box pb={8} w={'full'}>
			<Head title="Salaries" />
			<Box className="function">
				<FuncCollapse>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<CSVLink filename={'salaries.csv'} headers={headersCSV} data={dataCSV}>
								<Func
									icon={<BiExport />}
									description={'export to csv'}
									title={'export'}
									action={() => {}}
								/>
							</CSVLink>
						</>
					)}
					<Func
						icon={<VscFilter />}
						description={'Open draw to filter'}
						title={'filter'}
						action={onOpenFilter}
					/>
				</FuncCollapse>
			</Box>

			{/* Modal project category and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenHistory}
				onOpen={onOpenHistory}
				onClose={onCloseHistory}
				title="History Salary"
			>
				<HistorySalary employeeId={employeeId} />
			</Modal>
			{/* Modal project category and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenUpdateSalary}
				onOpen={onOpenUpdateSalary}
				onClose={onCloseUpdateSalary}
				title="Update Salary"
			>
				<UpdateSalary employeeId={employeeId} />
			</Modal>

			<Table
				data={dataSalaries?.salaries || []}
				columns={columns}
				isLoading={isLoading}
				filter={filter}
				isResetFilter={isResetFilter}
			/>

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
						columnId={'email'}
						label="Email"
						placeholder="Enter email"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>

					{employeesFilter && (
						<SelectCustom
							placeholder='Select employee'
							handleSearch={(field: any) => {
								setFilter({
									columnId: 'id',
									filterValue: field.value,
								})
							}}
							label={'Employee'}
							name={'employee'}
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

Salaries.getLayout = ClientLayout

export default Salaries
