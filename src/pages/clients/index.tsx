// get all country
import { CSVLink } from 'react-csv'
import countryList from 'react-select-country-list'

// query and mutation
import { deleteClientMutation, deleteClientsMutation, importCSVClientMutation } from 'mutations'
import { allClientCategoriesQuery, allClientsQuery, allClientSubCategoriesQuery } from 'queries'

// components
import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Head, Table } from 'components/common'
import { Drawer } from 'components/Drawer'

// use layout
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'

import { useRouter } from 'next/router'

import { useContext, useEffect, useMemo, useState } from 'react'

// icons
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { BiExport } from 'react-icons/bi'
import { FaFileCsv } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'

import { NextLayout } from 'type/element/layout'

// fucs, component to setup table
import { IFilter } from 'type/tableTypes'

// page add and update employee
import AddClient from './add-clients'

import UpdateClient from './update-clients'

// component to filter
import { DateRange, Input, Select, SelectUser } from 'components/filter'

import ImportCSV from 'components/importCSV'
import { IOption } from 'type/basicTypes'
import { IPeople } from 'type/element/commom'
import { VscFilter } from 'react-icons/vsc'
import { clientColumn } from 'utils/columns'

const Clients: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	const options = useMemo(() => countryList().getData(), [])

	//state
	const [dataCSV, setDataCSV] = useState<any[]>([])

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

	const {
		isOpen: isOpenImportCSV,
		onOpen: onOpenImportCSV,
		onClose: onCloseImportCSV,
	} = useDisclosure()

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'name', key: 'name' },
		{ label: 'salutation', key: 'salutation' },
		{ label: 'gender', key: 'gender' },
		{ label: 'email', key: 'email' },
		{ label: 'mobile', key: 'mobile' },
		{ label: 'avatar', key: 'avatar' },
		{ label: 'can_login', key: 'can_login' },
		{ label: 'can_receive_email', key: 'can_receive_email' },
		{ label: 'city', key: 'city' },
		{ label: 'client_category', key: 'client_category' },
		{ label: 'client_sub_category', key: 'client_sub_category' },
		{ label: 'company_address', key: 'company_address' },
		{ label: 'company_name', key: 'company_name' },
		{ label: 'country', key: 'country' },
		{ label: 'gst_vat_number', key: 'gst_vat_number' },
		{ label: 'note', key: 'note' },
		{ label: 'office_phone_number', key: 'office_phone_number' },
		{ label: 'official_website', key: 'official_website' },
		{ label: 'postal_code', key: 'postal_code' },
		{ label: 'shipping_address', key: 'shipping_address' },
		{ label: 'state', key: 'state' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	const headersCSVTemplate = [
		{ label: 'name', key: 'name' },
		{ label: 'gender', key: 'gender' },
		{ label: 'email', key: 'email' },
		{ label: 'password', key: 'password' },
		{ label: 'mobile', key: 'mobile' },
		{ label: 'city', key: 'city' },
		{ label: 'company_address', key: 'company_address' },
		{ label: 'company_name', key: 'company_name' },
		{ label: 'country', key: 'country' },
		{ label: 'gst_vat_number', key: 'gst_vat_number' },
		{ label: 'office_phone_number', key: 'office_phone_number' },
		{ label: 'official_website', key: 'official_website' },
		{ label: 'postal_code', key: 'postal_code' },
		{ label: 'shipping_address', key: 'shipping_address' },
		{ label: 'state', key: 'state' },
	]

	const dataCSVTemplate = [
		{
			name: 'Nguyen Quang Huy',
			gender: 'Female',
			email: 'huy@gmail.com',
			password: 'password',
			mobile: 84888888888,
			city: 'HCM',
			company_address: 'HCM',
			company_name: 'HUPROM',
			country: 'VN',
			gst_vat_number: 1000,
			office_phone_number: 84888888888,
			official_website: 'huprom.com',
			postal_code: 1000,
			shipping_address: '76 Cong Hoa HCM',
			state: 'Tan Binh',
		},
	]

	//State ---------------------------------------------------------------------
	// get id to delete client
	const [idClient, setIdClient] = useState<number | null>(null)

	// set loading table
	const [isLoading, setIsLoading] = useState(true)

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// data all users to select
	const [dataUsersSl, setAllUsersSl] = useState<IPeople[]>([])

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
	const { data: allCategories } = allClientCategoriesQuery()

	// get all sub categories
	const { data: allSubCategories } = allClientSubCategoriesQuery()

	// delete client
	const [mutateDeleteClient, { status: statusDl, data: dataDl }] = deleteClientMutation(setToast)

	// delete all clients
	const [mutateDeleteClients, { status: statusDlMany, data: dataDlMany }] =
		deleteClientsMutation(setToast)

	//mutation ------------------------------------------------------------------
	const [mutateImportCSV, { status: statusImportCSV, data: dataImportCSV }] =
		importCSVClientMutation(setToast)

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
		if (statusDl == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDl,
			})
			refetchAllClients()
		}
	}, [statusDl])

	// check is successfully delete many
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: statusDlMany,
			})
			setDataSl(null)
			refetchAllClients()
		}
	}, [statusDlMany])

	// check is successfully import csv
	useEffect(() => {
		if (statusImportCSV == 'success' && dataImportCSV?.message) {
			setToast({
				msg: dataImportCSV?.message,
				type: statusImportCSV,
			})
			setDataSl(null)
			refetchAllClients()
		}
	}, [statusImportCSV])

	// set loading == false when get all clients successfully
	useEffect(() => {
		if (allClients?.clients) {
			const users = allClients.clients?.map((item): IPeople => {
				return {
					id: item.id,
					name: item.name,
					avatar: item.avatar?.url,
				}
			})
			setAllUsersSl(users || [])
			setIsLoading(false)

			//Set data csv
			const dataCSV: any[] = allClients.clients.map((client) => ({
				id: client.id,
				name: client.name,
				salutation: client.salutation,
				gender: client.gender,
				email: client.email,
				mobile: client.mobile,
				avatar: client.avatar?.id,
				can_login: client.can_login ? 'true' : 'false',
				can_receive_email: client.can_receive_email ? 'true' : 'false',
				city: client.city,
				client_category: client.client_category?.id,
				client_sub_category: client.client_sub_category?.id,
				company_address: client.company_address,
				company_name: client.company_name,
				country: client.country,
				gst_vat_number: client.gst_vat_number,
				note: client.note,
				office_phone_number: client.office_phone_number,
				official_website: client.official_website,
				postal_code: client.postal_code,
				shipping_address: client.shipping_address,
				state: client.state,
				createdAt: client.createdAt,
				updatedAt: client.updatedAt,
			}))

			setDataCSV(dataCSV)
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

	// function --------------------------------------
	const handleImportCSV = (data: any) => {
		mutateImportCSV({
			clients: data,
		})

		onCloseImportCSV()
	}

	// header ----------------------------------------
	const columns = clientColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdClient(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setIdClient(id)
			onOpenUpdate()
		},
	})

	return (
		<Box w={'full'} pb={8}>
			<Head title="Clients" />
			<Box className="function">
				<FuncCollapse>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<Func
								icon={<IoAdd />}
								description={'Add new client by form'}
								title={'Add new'}
								action={onOpenAdd}
							/>
							<CSVLink filename={'clients.csv'} headers={headersCSV} data={dataCSV}>
								<Func
									icon={<BiExport />}
									description={'export to csv'}
									title={'export'}
									action={() => {}}
								/>
							</CSVLink>

							<CSVLink
								filename={'clientsTemplate.csv'}
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
								fieldsValid={[
									'name',
									'gender',
									'email',
									'password',
									'mobile',
									'city',
									'company_address',
									'company_name',
									'country',
									'gst_vat_number',
									'office_phone_number',
									'official_website',
									'postal_code',
									'shipping_address',
									'state',
								]}
								handleImportCSV={handleImportCSV}
								statusImport={statusImportCSV === 'running'}
								isOpenImportCSV={isOpenImportCSV}
								onCloseImportCSV={onCloseImportCSV}
								onOpenImportCSV={onOpenImportCSV}
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
						description={'Delete all client you selected'}
						action={onOpenDlMany}
						disabled={!dataSl || dataSl.length == 0 ? true : false}
					/>
				</FuncCollapse>
			</Box>

			{currentUser && (
				<Box className='table'>
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
				</Box>
			)}

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					mutateDeleteClient(String(idClient))
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
						mutateDeleteClients(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			{/* drawer to add client */}
			<Drawer size="xl" title="Add client" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddClient onCloseDrawer={onCloseAdd} />
			</Drawer>

			{/* drawer to update client */}
			<Drawer size="xl" title="Update client" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateClient onCloseDrawer={onCloseUpdate} clientUpdateId={idClient} />
			</Drawer>

			<Drawer
				size="xs"
				title="Filters"
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
						required={false}
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
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

					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'createdAt',
								filterValue: date,
							})
						}}
						label="Select date"
					/>

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
			</Drawer>
		</Box>
	)
}

Clients.getLayout = ClientLayout

export default Clients
