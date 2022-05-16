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
import AlertDialog from 'components/AlertDialog'
import DateRange from 'components/date/DateRange'
import Drawer from 'components/Drawer'
import { Input } from 'components/filter/Input'
import { Select } from 'components/filter/Select'
import SelectCustom from 'components/filter/SelectCustomer'
import { ClientLayout } from 'components/layouts'
import Table from 'components/Table'
import { AuthContext } from 'contexts/AuthContext'
import { deleteContractMutation, deleteContractsMutation } from 'mutations/contract'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { allClientsQuery } from 'queries/client'
import { allContractsQuery } from 'queries/contract'
import { allContractTypesQuery } from 'queries/contractType'
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

const Contracts: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//State ---------------------------------------------------------------------
	// is reset table
	const [contractIdUpdate, setContractIdUpdate] = useState<number | null>(6)

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

	// get contract types to select to filter
	const [cTypesFilter, setCTypesFilter] = useState<IOption[]>([])

	// get client to select to filter
	const [clientsFilter, setClientsFilter] = useState<IOption[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// query and mutation -=------------------------------------------------------
	// get all contracts
	const { data: allContracts, mutate: refetchAllContracts } = allContractsQuery(isAuthenticated)

	const { data: allContractTypes } = allContractTypesQuery()

	const { data: allClients } = allClientsQuery(isAuthenticated)

	// mutation
	// delete holidays
	const [mutateDeleteContracts, { status: statusDlContracts }] = deleteContractsMutation(setToast)

	// delete holiday
	const [mutateDeleteContract, { status: statusDl }] = deleteContractMutation(setToast)

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

	// set contract Types Filter
	useEffect(() => {
		if (allContractTypes) {
			setCTypesFilter(
				allContractTypes.contractTypes?.map((contractType) => {
					return {
						label: contractType.name,
						value: contractType.id,
					}
				}) as IOption[]
			)
		}
	}, [allContractTypes])

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
								<Link
									key={row.values['id']}
									href={`/contracts/public/${row.values['id']}`}
								>
									<MenuItem icon={<BiLinkAlt fontSize={'15px'} />}>
										Public Link
									</MenuItem>
								</Link>
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

							<Select
								options={cTypesFilter}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'contract_type'}
								label="Contract type"
								placeholder="Select type"
							/>
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
