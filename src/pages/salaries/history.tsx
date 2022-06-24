import {
	Avatar,
	Box,
	Button,
	HStack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from '@chakra-ui/react'
import { Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { deleteSalaryMutation } from 'mutations'
import { useRouter } from 'next/router'
import { historySalaryQuery } from 'queries'
import { useContext, useEffect } from 'react'
import { BsTrash } from 'react-icons/bs'

export interface IHistorySalaryProps {
	employeeId: string | number | null
}

export default function HistorySalary({ employeeId = 6 }: IHistorySalaryProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Mutation ----------------------------------------------------------
	const [mutateDeleSalary, { status: statusDeleSalary, data: dataDeleSalary }] =
		deleteSalaryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataHistorySalary, mutate: refetchHistorySalary } = historySalaryQuery(
		isAuthenticated,
		employeeId
	)
	console.log(dataHistorySalary)

	//Useeffect ---------------------------------------------------------
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

	//Refetch data project category and notice when delete success
	useEffect(() => {
		switch (statusDeleSalary) {
			case 'success':
				refetchHistorySalary()
				if (dataDeleSalary) {
					setToast({
						type: 'success',
						msg: dataDeleSalary?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleSalary])

	// Function ----------------------------------------------------------
	//Handle delete salary
	const onDelete = (salaryId: number) => {
		if (!salaryId) {
			setToast({
				msg: 'Not found salary to delete',
				type: 'warning',
			})
		} else {
			mutateDeleSalary({
				salaryId,
			})
		}
	}

	return (
		<Box>
			<VStack align={'start'}>
				<Box maxHeight={'400px'} overflow="auto" w={'full'}>
					{dataHistorySalary?.historySalary && (
						<HStack mb={5} w={'full'} paddingInline={6} spacing={5} paddingBottom={2}>
							<Avatar
								src={dataHistorySalary.historySalary.avatar?.url}
								name={dataHistorySalary.historySalary.name}
								boxSize={50}
							/>
							<VStack align={'start'}>
								<Text>{dataHistorySalary.historySalary.name}</Text>

								<Text fontSize={'14px'} color={'gray'}>{dataHistorySalary.historySalary.role}</Text>
							</VStack>
						</HStack>
					)}
					<TableContainer w="full" paddingInline={6} pos={'relative'}>
						<Table variant="simple">
							<Thead pos={'sticky'} top={'0px'}>
								<Tr>
									<Th w={'50px'}>#</Th>
									<Th>Amount</Th>
									<Th>Value Type</Th>
									<Th>Date</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataHistorySalary?.historySalary.salaries &&
									dataHistorySalary?.historySalary.salaries.map((salary) => (
										<Tr key={salary.id}>
											<Td>{salary.id}</Td>
											<Td
												color={
													salary.type === 'Increment' ? 'green' : 'red'
												}
											>
												{salary.type === 'Increment' ? '+' : '-'}$
												{salary.amount}
											</Td>
											<Td>{salary.type}</Td>
											<Td>{salary.date}</Td>
											<Td isNumeric>
												<Button
													leftIcon={<BsTrash />}
													colorScheme="gray"
													variant="outline"
													onClick={() => onDelete(salary.id)}
												>
													Delete
												</Button>
											</Td>
										</Tr>
									))}

								<Tr>
									<Td fontWeight={'bold'}>Total:</Td>
									<Td color={'red'} fontWeight={'bold'}>
										$
										{dataHistorySalary?.historySalary.salaries
											? dataHistorySalary?.historySalary.salaries.reduce(
													(accu, salary) => {
														if (salary.type === 'Increment') {
															return accu + salary.amount
														} else {
															return accu - salary.amount
														}
													},
													0
											  )
											: '0'}
									</Td>
									<Td></Td>
									<Td></Td>
									<Td></Td>
								</Tr>
							</Tbody>
						</Table>

						{statusDeleSalary === 'running' && <Loading />}
					</TableContainer>
				</Box>
			</VStack>
		</Box>
	)
}
