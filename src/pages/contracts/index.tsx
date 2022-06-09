import {
	Avatar,
	Button,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
	Drawer as CDrawer,
	useColorMode,
} from '@chakra-ui/react'
import { AlertDialog, Table } from 'components/common'
import { DateRange } from 'components/filter'
import { Drawer } from 'components/Drawer'
import { Input, SelectCustom, Select } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import {
	deleteContractMutation,
	deleteContractsMutation,
	publicLinkContractMutation,
} from 'mutations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { allClientsQuery, allContractsQuery, allContractTypesQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiLinkAlt } from 'react-icons/bi'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddContract from './add-contracts'
import UpdateContract from './update-contracts'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'

const Contracts: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//State ---------------------------------------------------------------------
	// is reset table
	const [contractIdUpdate, setContractIdUpdate] = useState<number | null>(6)

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// get id to delete employee
	const [idDlContract, setIdDlContract] = useState<number>()

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// get client to select to filter
	const [clientsFilter, setClientsFilter] = useState<IOption[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// query and mutation -=------------------------------------------------------
	// get all contracts
	const { data: allContracts, mutate: refetchAllContracts } = allContractsQuery(isAuthenticated)
	console.log(allContracts)

	const { data: allContractTypes } = allContractTypesQuery()

	const { data: allClients } = allClientsQuery(isAuthenticated)

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'alternate_address', key: 'alternate_address' },
		{ label: 'cell', key: 'cell' },
		{ label: 'city', key: 'city' },
		{ label: 'client', key: 'client' },
		{ label: 'company_logo', key: 'company_logo' },
		{ label: 'contract_type', key: 'contract_type' },
		{ label: 'contract_value', key: 'contract_value' },
		{ label: 'country', key: 'country' },
		{ label: 'currency', key: 'currency' },
		{ label: 'description', key: 'description' },
		{ label: 'notes', key: 'notes' },
		{ label: 'office_phone_number', key: 'office_phone_number' },
		{ label: 'postal_code', key: 'postal_code' },
		{ label: 'sign', key: 'sign' },
		{ label: 'state', key: 'state' },
		{ label: 'subject', key: 'subject' },
		{ label: 'end_date', key: 'end_date' },
		{ label: 'start_date', key: 'start_date' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	// mutation -------------------------------------------------------------------
	// delete holidays
	const [mutateDeleteContracts, { status: statusDlContracts }] = deleteContractsMutation(setToast)

	// delete holiday
	const [mutateDeleteContract, { status: statusDl }] = deleteContractMutation(setToast)

	// get public link
	const [mutateGetPublic, { data: contractToken, status: statusToken }] =
		publicLinkContractMutation(setToast)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	//User effect ---------------------------------------------------------------

	// set client to filter
	useEffect(() => {
		if (allClients?.clients) {
			const valuesFilter = allClients.clients.map(
				(client): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar size={'xs'} name={client.name} src={client.avatar?.url} />
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{client.name}
								</Text>
							</HStack>
						</>
					),
					value: String(client.id),
				})
			)
			setClientsFilter(valuesFilter)
		}
	}, [allClients, colorMode])

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
		if (allContracts) {
			console.log(allContracts)
			setIsloading(false)

			if (allContracts.contracts) {
				//Set data csv
				const dataCSV: any[] = allContracts.contracts.map((contract) => ({
					id: contract.id,
					alternate_address: contract.alternate_address,
					cell: contract.cell,
					city: contract.city,
					client: contract.client,
					company_logo: contract.company_logo?.id,
					contract_type: contract.contract_type?.id,
					contract_value: contract.contract_value,
					country: contract.country,
					currency: contract.currency,
					description: contract.description,
					notes: contract.notes,
					office_phone_number: contract.office_phone_number,
					postal_code: contract.postal_code,
					sign: contract.sign,
					state: contract.state,
					subject: contract.subject,
					end_date: contract.end_date,
					start_date: contract.start_date,
					createdAt: contract.createdAt,
					updatedAt: contract.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [allContracts])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlContracts == 'success') {
			setToast({
				msg: 'Delete employees successfully',
				type: 'success',
			})
			setDataSl(null)
			refetchAllContracts()
		}
	}, [statusDlContracts])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success') {
			setToast({
				msg: 'Delete employee successfully',
				type: 'success',
			})
			refetchAllContracts()
		}
	}, [statusDl])

	useEffect(() => {
		if (statusToken == 'success' && contractToken) {
			router.push(`/contracts/public/${contractToken.token}`)
		}
	}, [statusToken])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Contracts',

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
					Header: 'Subject',
					accessor: 'subject',
					minWidth: 180,
					width: 180,
					filter: textFilter(['subject']),
					Cell: ({ value, row }) => (
						<Text
							_hover={{
								color: 'hu-Green.normal',
							}}
						>
							<Link key={row.values['id']} href={`/contracts/${row.values['id']}`}>
								{value}
							</Link>
						</Text>
					),
				},
				{
					Header: 'Contract type',
					accessor: 'contract_type',
					minWidth: 180,
					width: 180,
					filter: selectFilter(['contract_type', 'id']),
					Cell: () => '',
				},
				{
					Header: 'Client',
					accessor: 'client',
					minWidth: 250,
					filter: selectFilter(['client', 'id']),
					Cell: ({ row }) => {
						return (
							<HStack w={'full'} spacing={5}>
								<Avatar
									flex={'none'}
									size={'sm'}
									name={row.original.client.name}
									src={row.original.client.avatar?.url}
								/>
								<VStack w={'70%'} alignItems={'start'}>
									<Text isTruncated w={'full'}>
										{row.original.client.salutation
											? `${row.original.salutation}. ${row.original.client.name}`
											: row.original.client.name}
									</Text>
									<Text isTruncated w={'full'} fontSize={'sm'} color={'gray.400'}>
										{row.original.client.company_name}
									</Text>
								</VStack>
							</HStack>
						)
					},
				},
				{
					Header: 'Amount',
					accessor: 'amount',
					minWidth: 180,
					width: 180,
					Cell: ({ row }) => (
						<Text>{`${row.original.contract_value} ${row.original.currency}`}</Text>
					),
				},
				{
					Header: 'Start date',
					accessor: 'start_date',
					minWidth: 180,
					width: 180,
					filter: dateFilter(['start_date']),
					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'End date',
					accessor: 'end_date',
					minWidth: 180,
					width: 180,
					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (
							<Text>{`${date.getDate()}-${
								date.getMonth() + 1
							}-${date.getFullYear()}`}</Text>
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
								<Link
									key={row.values['id']}
									href={`/contracts/${row.values['id']}`}
								>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										view
									</MenuItem>
								</Link>

								<MenuItem
									onClick={() => {
										mutateGetPublic(row.values['id'])
									}}
									icon={<BiLinkAlt fontSize={'15px'} />}
								>
									Public Link
								</MenuItem>
								<MenuItem
									onClick={() => {
										setContractIdUpdate(row.values['id'])
										onOpenUpdate()
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>

								<MenuItem
									onClick={() => {
										setIdDlContract(row.values['id'])
										onOpenDl()
									}}
									icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
								>
									Delete
								</MenuItem>
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	return (
		<>
			<Button colorScheme="blue" onClick={onOpenAdd}>
				Add new
			</Button>
			{currentUser && currentUser.role === 'Admin' && (
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
					<CSVLink filename={'contracts.csv'} headers={headersCSV} data={dataCSV}>
						export to csv
					</CSVLink>
				</Button>
			)}
			<Button disabled={!dataSl || dataSl.length == 0 ? true : false} onClick={onOpenDlMany}>
				Delete all
			</Button>
			<Button colorScheme="blue" onClick={onOpenFilter}>
				filter
			</Button>
			<Button colorScheme="blue" onClick={onOpenAdd}>
				Add new
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
				data={allContracts?.contracts || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
				disableColumns={['contract_type']}
			/>
			<Drawer size="xl" title="Add Contract" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddContract onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Contract" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateContract onCloseDrawer={onCloseUpdate} contractIdUpdate={contractIdUpdate} />
			</Drawer>
			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsloading(true)
						mutateDeleteContracts(dataSl)
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
					mutateDeleteContract(String(idDlContract))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			{/* filter */}
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
								columnId={'subject'}
								label="Subject"
								placeholder="Enter subject"
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
								type={'text'}
							/>
							{allContractTypes && (
								<Select
									options={allContractTypes.contractTypes?.map((type) => ({
										label: type.name,
										value: type.id,
									}))}
									handleSearch={(data: IFilter) => {
										setFilter(data)
									}}
									columnId={'contract_type'}
									label="Contract type"
									placeholder="Select type"
								/>
							)}
							<DateRange
								handleSelect={(date: { from: Date; to: Date }) => {
									setFilter({
										columnId: 'start_date',
										filterValue: date,
									})
								}}
								label="Select date"
							/>
							{clientsFilter && (
								<SelectCustom
									handleSearch={(field: any) => {
										console.log(field)
										setFilter({
											columnId: 'client',
											filterValue: field.value,
										})
									}}
									label={'Client'}
									name={'client'}
									options={[
										{
											label: (
												<Text
													color={colorMode == 'light' ? 'black' : 'white'}
												>
													all
												</Text>
											),
											value: '',
										},

										...clientsFilter,
									]}
									required={false}
								/>
							)}
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</>
	)
}

Contracts.getLayout = ClientLayout

export default Contracts
