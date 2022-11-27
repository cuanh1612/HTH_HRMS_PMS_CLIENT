import { Avatar, Box, Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, InputNumber, Select } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateSalaryMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allSalariesQuery, historySalaryQuery } from 'queries'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { updateSalaryForm } from 'type/form/basicFormType'
import { dataSalaryType } from 'utils/basicData'
import { updateSalaryValidate } from 'utils/validate'

export interface IUpdateSalaryProps {
	employeeId: string | number | null
}

export default function UpdateSalary({ employeeId = 6 }: IUpdateSalaryProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Mutation ----------------------------------------------------------
	const [mutateUpSalary, { status: statusUpSalary, data: dataUpSalary }] =
		updateSalaryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataHistorySalary, mutate: refetchHistorySalary } = historySalaryQuery(
		isAuthenticated,
		employeeId
	)
	console.log(dataHistorySalary)
	const { mutate: refetchSSalaries } = allSalariesQuery(isAuthenticated)

	// setForm and submit update salary ---------------------------------
	const formSetting = useForm<updateSalaryForm>({
		defaultValues: {
			amount: 1,
			type: undefined,
			date: undefined,
		},
		resolver: yupResolver(updateSalaryValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateSalaryForm) => {
		if (!employeeId) {
			setToast({
				msg: 'Not found employee to update salary',
				type: 'warning',
			})
		} else {
			values.employee = Number(employeeId)
			await mutateUpSalary(values)
		}
	}

	//UseEffect ---------------------------------------------------------
	//Handle check logged in
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
		switch (statusUpSalary) {
			case 'success':
				formSetting.reset({
					amount: 1,
					type: undefined,
					date: undefined,
				})

				if (dataUpSalary) {
					setToast({
						type: statusUpSalary,
						msg: dataUpSalary?.message,
					})
				}

				refetchHistorySalary()
				refetchSSalaries()

				break

			default:
				break
		}
	}, [statusUpSalary])

	return (
		<Box>
			<VStack align={'start'}>
				{dataHistorySalary?.historySalary && (
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={[2, 1]}>
							<HStack w={'full'} paddingInline={6} paddingBottom={2}>
								<Avatar
									src={dataHistorySalary.historySalary.avatar?.url}
									name={dataHistorySalary.historySalary.name}
									boxSize={50}
								/>
								<VStack align={'start'}>
									<Text>{dataHistorySalary.historySalary.name}</Text>

									<Text color={'gray.400'}>
										{dataHistorySalary.historySalary.role}
									</Text>
								</VStack>
							</HStack>
						</GridItem>
						<GridItem w="100%" paddingInline={6} colSpan={[2, 1]}>
							<VStack align={'start'}>
								<Text>MonthSalary</Text>
								<Text fontWeight={'bold'}>
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
								</Text>
							</VStack>
						</GridItem>
					</Grid>
				)}

				<Box
					pos="relative"
					p={6}
					as={'form'}
					h="auto"
					onSubmit={handleSubmit(onSubmit)}
					w="100%"
				>
					<Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
						<GridItem w="100%" colSpan={[3, 1]}>
							<InputNumber
								form={formSetting}
								label={'Amount'}
								name={'amount'}
								required={true}
								min={1}
							/>
						</GridItem>

						<GridItem w="100%" colSpan={[3, 1]}>
							<Select
								form={formSetting}
								label={'Value Type'}
								required={true}
								name={'type'}
								options={dataSalaryType}
							/>
						</GridItem>

						<GridItem w="100%" colSpan={[3, 1]}>
							<Input
								name="date"
								label="Date"
								icon={
									<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />
								}
								form={formSetting}
								placeholder="Select Joining Date"
								type="date"
								required
							/>
						</GridItem>
					</Grid>

					<VStack align={'end'}>
						<Button
							transform={'auto'}
							_hover={{ bg: 'hu-Green.normalH', scale: 1.05, color: 'white' }}
							_active={{
								bg: 'hu-Green.normalA',
								scale: 1,
								color: 'white',
							}}
							leftIcon={<AiOutlineCheck />}
							mt={6}
							type="submit"
							isLoading={statusUpSalary === 'running' ? true : false}
						>
							Save
						</Button>
					</VStack>
				</Box>
			</VStack>
		</Box>
	)
}
