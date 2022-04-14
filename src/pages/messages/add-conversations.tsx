import { Box, Button, Grid, GridItem, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Select } from 'components/form/Select'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { createConversationMutation } from 'mutations/conversation'
import { useRouter } from 'next/router'
import { allEmployeesQuery } from 'queries/employee'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { mutate } from 'swr'
import { IOption } from 'type/basicTypes'
import { createConversationForm } from 'type/form/basicFormType'
import { createConversationValidate } from 'utils/validate'

export interface IAddConversationsProps {}

export default function AddConversations(props: IAddConversationsProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//Query -------------------------------------------------------------
	const { data: dataEmployees } = allEmployeesQuery(isAuthenticated)
	console.log(dataEmployees)

	//mutation ----------------------------------------------------------
	const [mutateCreConversation, { status: statusCreConversation, data: dataCreConversation }] =
		createConversationMutation(setToast)

	//State -------------------------------------------------------------
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])

	// setForm and submit form create conversation ----------------------
	const formSetting = useForm<createConversationForm>({
		defaultValues: {
			user_two: '',
		},
		resolver: yupResolver(createConversationValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: createConversationForm) => {
		if (!currentUser?.id) {
			setToast({
				type: 'warning',
				msg: 'Please login first',
			})
		} else {
			values.user_one = currentUser.id.toString()

			//Create conversation
			mutateCreConversation(values)
		}
	}

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

	//Set options select employees/
	useEffect(() => {
		if (dataEmployees?.employees) {
			const newOptionEmployees: IOption[] = dataEmployees.employees.map((employee) => {
				return {
					value: employee.id.toString(),
					label: employee.email,
				}
			})

			console.log(newOptionEmployees)

			setOptionEmployees(newOptionEmployees)
		}
	}, [dataEmployees])

	//Note when request success
	useEffect(() => {
		if (statusCreConversation === 'success') {
			mutate(`conversations/user/${currentUser?.id}`)

			setToast({
				type: 'success',
				msg: dataCreConversation?.message as string,
			})
		}
	}, [statusCreConversation])

	return (
		<>
			<Box pos="relative" px={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2]}>
						<Select
							name="user_two"
							label="Choose Member"
							required
							form={formSetting}
							placeholder={'Select Member'}
							options={optionEmployees}
						/>
					</GridItem>
				</Grid>

				<VStack align={'end'}>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						transform="auto"
						_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
						_active={{
							bg: 'hu-Green.normalA',
							scale: 1,
						}}
						leftIcon={<AiOutlineCheck />}
						mt={6}
						type="submit"
					>
						Save
					</Button>
				</VStack>

                {statusCreConversation === 'running' && <Loading />}
			</Box>
		</>
	)
}
