import { Avatar, Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure, VStack } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import Table from 'components/Table'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allContractsQuery } from 'queries/contract'
import { useContext, useEffect, useState } from 'react'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import AddContract from './add-contracts'
import UpdateContract from './update-contracts'

const Contracts: NextLayout = ()=> {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

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

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	// query and mutation -=------------------------------------------------------
	// get all contracts
	const { data: allContracts, mutate: refetchAllEmplContracts } =
		allContractsQuery(isAuthenticated)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

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
		if (allContracts) {
			console.log(allContracts)
			setIsloading(false)
		}
	}, [allContracts])

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
				},
				{
					Header: 'Client',
					accessor: 'client',
					minWidth: 250,
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
					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (<Text>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</Text>)
					}
					
				},
				{
					Header: 'End date',
					accessor: 'end_date',
					minWidth: 180,
					width: 180,
					Cell: ({ value }) => {
						const date = new Date(value as string)
						return (<Text>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</Text>)
					}
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
										
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>
								
									<MenuItem
										onClick={() => {

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
				open add contract
			</Button>
			<Button colorScheme="blue" onClick={onOpenUpdate}>
				open update contract
			</Button>
			<Table
				data={allContracts?.contracts || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				disableColumns={['category', 'subcategory', 'country']}
				isResetFilter={isResetFilter}
			/>
			<Drawer size="xl" title="Add Contract" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddContract onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Contract" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateContract onCloseDrawer={onCloseUpdate} contractIdUpdate={contractIdUpdate} />
			</Drawer>
		</>
	)
}

Contracts.getLayout = ClientLayout

export default Contracts
