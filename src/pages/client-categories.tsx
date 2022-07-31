import {
	Box,
	Button,
	Divider,
	Editable,
	EditableInput,
	EditablePreview,
	HStack,
	Input,
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
import {ButtonIcon, Loading} from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import {
	createCategoryMutation,
	deleteCategoryMutation,
	updateCategoryMutation,
} from 'mutations'
import { useRouter } from 'next/router'
import { allClientCategoriesQuery } from 'queries'
import { ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export default function ClientCategory() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreCategory, { status: statusCreCategory, data: dataCreCategory }] =
		createCategoryMutation(setToast)
	const [mutateDeleCategory, { status: statusDeleCategory, data: dataDeleCategory }] =
		deleteCategoryMutation(setToast)
	const [mutateUpCategory, { status: statusUpCategory, data: dataUpCategory }] =
		updateCategoryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataClientCategories, mutate: refetchClientCategories } =
		allClientCategoriesQuery()

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

	//Notice when create success
	useEffect(() => {
		switch (statusCreCategory) {
			case 'success':
				refetchClientCategories()
				if (dataCreCategory) {
					setToast({
						type: statusCreCategory,
						msg: dataCreCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreCategory])

	//Refetch data department and notice when delete success
	useEffect(() => {
		switch (statusDeleCategory) {
			case 'success':
				refetchClientCategories()
				if (dataDeleCategory) {
					setToast({
						type: statusDeleCategory,
						msg: dataDeleCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleCategory])

	//Refetch data department and notice when update success
	useEffect(() => {
		switch (statusUpCategory) {
			case 'success':
				refetchClientCategories()
				if (dataUpCategory) {
					setToast({
						type: statusUpCategory,
						msg: dataUpCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpCategory])

	// Function ----------------------------------------------------------
	const onChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
		setName(e.target.value)
	}

	//Handle submit form
	const onSubmit = () => {
		if (!name) {
			setToast({
				type: 'warning',
				msg: 'Please enter full field',
			})
		} else {
			mutateCreCategory({
				name,
			})
			setName('')
		}
	}

	//Handle delete client category
	const onDelete = (clientCategoryId: number) => {
		mutateDeleCategory({
			clientCategoryId,
		})
	}

	//Handle update client category
	const onUpdate = (clientCategoryId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpCategory({
				clientCategoryId,
				name: newName,
			})
		}
	}

	return (
		<Box>
			<VStack align={'start'}>
				<Box maxHeight={'400px'} overflow="auto" w={'full'}>
					<TableContainer w="full" paddingInline={6} pos={'relative'}>
						<Table variant="simple">
							<Thead pos={'sticky'} top={'0px'}>
								<Tr>
									<Th w={'50px'}>#</Th>
									<Th>Category Name (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataClientCategories?.clientCategories &&
									dataClientCategories.clientCategories.map((category) => (
										<Tr key={category.id}>
											<Td>{category.id}</Td>
											<Td>
												<Editable defaultValue={category.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(e) => {
															onUpdate(
																category.id,
																category.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(category.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleCategory === 'running' || statusUpCategory === 'running') && (
							<Loading />
						)}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Category Name</Text>
						<HStack w={'full'}>
							<Input
								type={'text'}
								placeholder="Enter name department"
								required
								value={name}
								onChange={onChangeName}
							/>
							<Button
								transform="auto"
								_hover={{ bg: 'hu-Green.normalH', scale: 1.05, color: 'white' }}
								_active={{
									bg: 'hu-Green.normalA',
									scale: 1,
									color: 'white',
								}}
								leftIcon={<AiOutlineCheck />}
								mt={6}
								type="submit"
								onClick={onSubmit}
								isLoading={statusCreCategory === 'running' ? true : false}
							>
								Save
							</Button>
						</HStack>
					</VStack>
				</Box>
			</VStack>
		</Box>
	)
}
