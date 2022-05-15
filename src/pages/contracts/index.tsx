import { Avatar, Button, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import Table from 'components/Table'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allContractsQuery } from 'queries/contract'
import { useContext, useEffect, useState } from 'react'
import { IFilter, TColumn } from 'type/tableTypes'
import AddContract from './add-contracts'
import UpdateContract from './update-contracts'

export interface ILeaveProps {}

export default function Leave({}: ILeaveProps) {
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
					minWidth: 180,
					width: 180,
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
