import {
	Box,
	Button,
	Divider,
	Editable,
	EditableInput,
	EditablePreview,
	Grid,
	GridItem, Input,
	Select,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack
} from '@chakra-ui/react'
import {ButtonIcon, Loading} from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import {
	createSubCategoryMutation,
	deleteSubCategoryMutation,
	updateSubCategoryMutation
} from 'mutations'
import { useRouter } from 'next/router'
import { allClientCategoriesQuery, allClientSubCategoriesQuery } from 'queries'
import { ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export default function ClientSubCategory() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')
	const [category, setCategory] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreSubCategory, { status: statusCreSubCategory, data: dataCreSubCategory }] =
		createSubCategoryMutation(setToast)
	const [mutateDeleSubCategory, { status: statusDeleSubCategory, data: dataDeleSubCategory }] =
		deleteSubCategoryMutation(setToast)
	const [mutateUpSubCategory, { status: statusUpSubCategory, data: dataUpSubCategory }] =
		updateSubCategoryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataClientSubCategories, mutate: refetchClientSubCategories } =
		allClientSubCategoriesQuery()
	const { data: dataClientCategories } = allClientCategoriesQuery()

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

	//Notice when create success
	useEffect(() => {
		switch (statusCreSubCategory) {
			case 'success':
				refetchClientSubCategories()
				if (dataCreSubCategory) {
					setToast({
						type: statusCreSubCategory,
						msg: dataCreSubCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreSubCategory])

	//Refetch data department and notice when delete success
	useEffect(() => {
		switch (statusDeleSubCategory) {
			case 'success':
				refetchClientSubCategories()
				if (dataDeleSubCategory) {
					setToast({
						type: statusDeleSubCategory,
						msg: dataDeleSubCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleSubCategory])

	//Refetch data department and notice when update success
	useEffect(() => {
		switch (statusUpSubCategory) {
			case 'success':
				refetchClientSubCategories()
				if (dataUpSubCategory) {
					setToast({
						type: statusUpSubCategory,
						msg: dataUpSubCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpSubCategory])

	// Function ----------------------------------------------------------
	const onChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
		setName(e.target.value)
	}

	//Handle submit form
	const onSubmit = () => {
		if (!name || !category) {
			setToast({
				type: 'warning',
				msg: 'Please enter full field',
			})
		} else {
			mutateCreSubCategory({
				name,
				client_category: Number(category),
			})
			setName('')
			setCategory('')
		}
	}

	//Handle delete client sub category
	const onDelete = (clientCategoryId: number) => {
		mutateDeleSubCategory({
			clientCategoryId,
		})
	}

	//Handle update client sub category
	const onUpdate = (clientSubCategoryId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpSubCategory({
				clientSubCategoryId,
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
									<Th>Sub Category Name (click to edit)</Th>
									<Th>Category</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataClientSubCategories?.clientSubCategories &&
									dataClientSubCategories.clientSubCategories.map(
										(subCategory) => (
											<Tr key={subCategory.id}>
												<Td>{subCategory.id}</Td>
												<Td>
													<Editable defaultValue={subCategory.name}>
														<EditablePreview />
														<EditableInput
															paddingLeft={2}
															onBlur={(e) => {
																onUpdate(
																	subCategory.id,
																	subCategory.name,
																	e.target.value
																)
															}}
														/>
													</Editable>
												</Td>
												<Td>{subCategory.client_category.name}</Td>
												<Td isNumeric>
													<ButtonIcon
														ariaLabel="button-delete"
														handle={() => onDelete(subCategory.id)}
														icon={<MdDeleteOutline />}
													/>
												</Td>
											</Tr>
										)
									)}
							</Tbody>
						</Table>
						{(statusDeleSubCategory === 'running' ||
							statusUpSubCategory === 'running') && <Loading />}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Stack w="full">
							<Grid templateColumns="repeat(2, 1fr)" gap={6}>
								<GridItem w="100%" colSpan={[2, 1]}>
									<VStack align={'start'}>
										<Text>Category</Text>

										<Select
											placeholder="Select option"
											value={category}
											onChange={(e) => setCategory(e.target.value)}
										>
											{dataClientCategories?.clientCategories &&
												dataClientCategories.clientCategories.map(
													(category) => (
														<option
															key={category.id}
															value={category.id}
														>
															{category.name}
														</option>
													)
												)}
										</Select>
									</VStack>
								</GridItem>

								<GridItem w="100%" colSpan={[2,1]}>
									<VStack align={'start'}>
										<Text>Sub Category Name</Text>

										<Input
											type={'text'}
											placeholder="Enter name department"
											required
											value={name}
											onChange={onChangeName}
										/>
									</VStack>
								</GridItem>
							</Grid>
						</Stack>

						<VStack w={'full'} align={'end'}>
							<Button
								mt={2}
								transform="auto"
								_hover={{ bg: 'hu-Green.normalH', scale: 1.05, color: 'white' }}
								_active={{
									bg: 'hu-Green.normalA',
									scale: 1,
									color: 'white',
								}}
								leftIcon={<AiOutlineCheck />}
								type="submit"
								onClick={onSubmit}
								isLoading={statusCreSubCategory === 'running' ? true : false}
							>
								Save
							</Button>
						</VStack>
					</VStack>
				</Box>
			</VStack>
		</Box>
	)
}
