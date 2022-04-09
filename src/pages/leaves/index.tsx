// get all country
import countryList from 'react-select-country-list'

// query and mutation
import { allClientsQuery } from 'queries/client'
import { deleteClientMutation, deleteClientsMutation } from 'mutations/client'
import { allClientCategoriesQuery } from 'queries/clientCategory'
import { allClientSubCategoriesQuery } from 'queries/clientSubCategory'

// components
import {
	Avatar,
	Badge,
	Box,
	Collapse,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	Button,
	useDisclosure,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	Drawer as CDrawer,
	DrawerBody,
	DrawerCloseButton,
	VStack,
} from '@chakra-ui/react'
import AlertDialog from 'components/AlertDialog'
import Drawer from 'components/Drawer'

// use layout
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'

import { useRouter } from 'next/router'

import { useContext, useEffect, useMemo, useState } from 'react'

// icons
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineSearch } from 'react-icons/ai'
import { BiExport, BiImport } from 'react-icons/bi'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'

import { NextLayout } from 'type/element/layout'

// fucs, component to setup table
import Table from 'components/Table'
import { IFilter, TColumn } from 'type/tableTypes'

// filter of column
import { dateFilter, selectFilter, textFilter } from 'utils/filters'

// page add and update employee
import AddLeave from './add-leaves'

import UpdateLeave from './update-leaves'

// component to filter
import { Input } from 'components/filter/Input'
import SelectUser from 'components/filter/SelectUser'
import DateRange from 'components/date/DateRange'
import { Select } from 'components/filter/Select'

import { IPeople } from 'type/element/commom'
import { IOption } from 'type/basicTypes'

const Clients: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	const options = useMemo(() => countryList().getData(), [])

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// set isOpen drawer to add, update
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

	//set isopen of function
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: true,
	})

	//State ---------------------------------------------------------------------
	// get id to delete client
	const [idDeleteClient, setIdDeleteClient] = useState<number>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	const [clientIdUpdate, setClientIdUpdate] = useState<number | null>(30)

	// data all users to select
	const [dataUsersSl, setAllusersSl] = useState<IPeople[]>([])

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// all categories
	const [categories, setCts] = useState<IOption[]>()

	// all sub categories
	const [subCategories, setSubCts] = useState<IOption[]>()

	// query and mutation -=------------------------------------------------------
	// get all clients
	const { data: allClients, mutate: refetchAllClients } = allClientsQuery(isAuthenticated)

	// get all categories
	const { data: allCategories, mutate: refetchAllCts } = allClientCategoriesQuery()

	// get all sub categories
	const { data: allSubCategories, mutate: refetchAllSubCts } = allClientSubCategoriesQuery()

	// delete client
	const [mutateDeleteClient, { status: statusDl }] = deleteClientMutation(setToast)

	// delete all clients
	const [mutateDeleteClients, { status: statusDlMany }] = deleteClientsMutation(setToast)

	//User effect ---------------------------------------------------------------
	// check authenticate in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// check is successfully delete one
	useEffect(() => {
		if (statusDl == 'success') {
			setToast({
				msg: 'Delete client successfully',
				type: 'success',
			})
			refetchAllClients()
		}
	}, [statusDl])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success') {
			setToast({
				msg: 'Delete clients successfully',
				type: 'success',
			})
			setDataSl(null)
			refetchAllClients()
		}
	}, [statusDlMany])

	// set loading == false when get all clients successfully
	useEffect(() => {
		if (allClients) {
			const users = allClients.clients?.map((item): IPeople => {
				return {
					id: item.id,
					name: item.name,
					avatar: item.avatar?.url,
				}
			})
			setAllusersSl(users || [])
			setIsloading(false)
		}
	}, [allClients])

	// set all categories to select
	useEffect(() => {
		if (allCategories) {
			const data = allCategories.clientCategories?.map(
				(item): IOption => ({
					label: item.name,
					value: String(item.id),
				})
			)
			setCts(data)
		}
	}, [allCategories])

	// set all sub categories to select
	useEffect(() => {
		if (allSubCategories) {
			const data = allSubCategories.clientSubCategories?.map(
				(item): IOption => ({
					label: item.name,
					value: String(item.id),
				})
			)
			setSubCts(data)
		}
	}, [allSubCategories])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Clients',

			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					filter: selectFilter(['id']),
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
					minWidth: 250,
					Cell: ({ value, row }) => {
						return (
							<HStack w={'full'} spacing={5}>
								<Avatar
									flex={'none'}
									size={'sm'}
									name={row.values['name']}
									src={row.original.avatar?.url}
								/>
								<VStack w={'70%'} alignItems={'start'}>
									<Text isTruncated w={'full'}>
										{row.original.salutation
											? `${row.original.salutation}. ${value}`
											: value}
										{currentUser?.email == row.values['email'] && (
											<Badge
												marginLeft={'5'}
												color={'white'}
												background={'gray.500'}
											>
												It's you
											</Badge>
										)}
									</Text>
									{row.original.company_name && (
										<Text
											isTruncated
											w={'full'}
											fontSize={'sm'}
											color={'gray.400'}
										>
											{row.original.company_name}
										</Text>
									)}
								</VStack>
							</HStack>
						)
					},
				},
				{
					Header: 'Email',
					accessor: 'email',
					minWidth: 150,
					filter: textFilter(['email']),
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},

				{
					Header: 'Status',
					accessor: 'status',
					minWidth: 150,
					Cell: () => {
						return (
							<HStack alignItems={'center'}>
								<Box
									background={'hu-Green.normal'}
									w={'3'}
									borderRadius={'full'}
									h={'3'}
								/>
								<Text>Active</Text>
							</HStack>
						)
					},
				},
				{
					Header: 'Created',
					accessor: 'createdAt',
					minWidth: 150,
					filter: dateFilter(['createdAt']),
					Cell: ({ value }) => {
						const createdDate = new Date(value).toLocaleDateString('en-GB')
						return <Text isTruncated>{createdDate}</Text>
					},
				},
				{
					Header: 'Category',
					accessor: 'category',
					filter: selectFilter(['client_category', 'id']),
				},
				{
					Header: 'Subcategory',
					accessor: 'subcategory',
					filter: selectFilter(['client_sub_category', 'id']),
				},
				{
					Header: 'Country',
					accessor: 'country',
					filter: selectFilter(['country']),
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
								<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>View</MenuItem>
								<MenuItem
									onClick={() => {
										setClientIdUpdate(row.values['id'])
										onOpenUpdate()
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>
								{currentUser?.email != row.values['email'] && (
									<MenuItem
										onClick={() => {
											setIdDeleteClient(row.values['id'])
											onOpenDl()
										}}
										icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
									>
										Delete
									</MenuItem>
								)}
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	return (
		<Box>
			<HStack
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggle}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
			>
				<Text fontWeight={'semibold'}>Function</Text>
				{isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse in={isOpen} animateOpacity>
				<HStack marginTop={'2'} paddingBlock={'5'} spacing={'5'}>
					<Button
						onClick={onOpenAdd}
						transform={'auto'}
						bg={'hu-Green.lightA'}
						_hover={{
							bg: 'hu-Green.normal',
							color: 'white',
							scale: 1.05,
						}}
						color={'hu-Green.normal'}
						leftIcon={<IoAdd />}
					>
						Add clients
					</Button>
					<Button
						transform={'auto'}
						_hover={{
							bg: 'hu-Pink.normal',
							color: 'white',
							scale: 1.05,
						}}
						leftIcon={<IoAdd />}
						borderColor={'hu-Pink.normal'}
						color={'hu-Pink.dark'}
						variant={'outline'}
					>
						Invite Client
					</Button>
					<Button
						transform={'auto'}
						_hover={{
							bg: 'hu-Pink.normal',
							color: 'white',
							scale: 1.05,
						}}
						leftIcon={<BiImport />}
						borderColor={'hu-Pink.normal'}
						color={'hu-Pink.dark'}
						variant={'outline'}
					>
						Import
					</Button>
					<Button
						transform={'auto'}
						_hover={{
							bg: 'hu-Pink.normal',
							color: 'white',
							scale: 1.05,
						}}
						leftIcon={<BiExport />}
						borderColor={'hu-Pink.normal'}
						color={'hu-Pink.dark'}
						variant={'outline'}
					>
						Export
					</Button>
					<Button
						disabled={!dataSl || dataSl.length == 0 ? true : false}
						onClick={onOpenDlMany}
					>
						Delete all
					</Button>
					<Button onClick={onOpenFilter}>open filter</Button>
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
				</HStack>
			</Collapse>

			{currentUser && (
				<Table
					data={allClients?.clients || []}
					columns={columns}
					isLoading={isLoading}
					isSelect
					selectByColumn="id"
					setSelect={(data: Array<number>) => setDataSl(data)}
					disableRows={{
						column: 'email',
						values: [currentUser.email],
					}}
					filter={filter}
					disableColumns={['category', 'subcategory', 'country']}
					isResetFilter={isResetFilter}
				/>
			)}

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					mutateDeleteClient(String(idDeleteClient))
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
						mutateDeleteClients(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			{/* drawer to add leave */}
			<Drawer size="xl" title="Add client" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeave onCloseDrawer={onCloseAdd} />
			</Drawer>

			{/* drawer to update leave */}
			<Drawer size="xl" title="Update client" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeave onCloseDrawer={onCloseUpdate} leaveId={clientIdUpdate} />
			</Drawer>

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
								columnId={'email'}
								label="Email"
								placeholder="Enter email"
								required={false}
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
								type={'text'}
							/>

							<Select
								options={categories}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'category'}
								label="Category"
								placeholder="Select category"
								required={false}
							/>

							<Select
								options={subCategories}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'subcategory'}
								label="Sub category"
								placeholder="Select sub category"
								required={false}
							/>

							<Select
								options={options}
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'country'}
								label="Country"
								placeholder="Select country"
								required={false}
							/>

							<DateRange handleSelect={(date: {
								from: Date,
								to: Date
								
							})=> {
								setFilter({
									columnId: 'createdAt',
									filterValue: date
								})
							}} label="Select date" />
							<SelectUser
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'id'}
								required={false}
								label={'Client'}
								peoples={dataUsersSl}
							/>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</Box>
	)
}

Clients.getLayout = ClientLayout

export default Clients
