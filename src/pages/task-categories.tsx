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
	createTaskCategoryMutation,
	deleteTaskCategoryMutation,
	updateTaskCategoryMutation,
} from 'mutations'
import { useRouter } from 'next/router'
import { allTaskCategoriesQuery } from 'queries'
import { ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export default function TaskCategory() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreCategory, { status: statusCreTaskCategory, data: dataCreTaskCategory }] =
		createTaskCategoryMutation(setToast)
	const [mutateDeleCategory, { status: statusDeleTaskCategory, data: dataDeleTaskCategory }] =
		deleteTaskCategoryMutation(setToast)
	const [mutateUpCategory, { status: statusUpTaskCategory, data: dataUpTaskCategory }] =
		updateTaskCategoryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataTaskCategories, mutate: refetchTaskCategories } = allTaskCategoriesQuery()
	console.log(dataTaskCategories);
	

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
		switch (statusCreTaskCategory) {
			case 'success':
				refetchTaskCategories()
				if (dataCreTaskCategory) {
					setToast({
						type: statusCreTaskCategory,
						msg: dataCreTaskCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreTaskCategory])

	//Refetch data department and notice when delete success
	useEffect(() => {
		switch (statusDeleTaskCategory) {
			case 'success':
				refetchTaskCategories()
				if (dataDeleTaskCategory) {
					setToast({
						type: statusDeleTaskCategory,
						msg: dataDeleTaskCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleTaskCategory])

	//Refetch data department and notice when update success
	useEffect(() => {
		switch (statusUpTaskCategory) {
			case 'success':
				refetchTaskCategories()
				if (dataUpTaskCategory) {
					setToast({
						type: statusUpTaskCategory,
						msg: dataUpTaskCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpTaskCategory])

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

	//Handle delete task category
	const onDelete = (taskCategoryId: number) => {
		mutateDeleCategory({
			taskCategoryId,
		})
	}

	//Handle update client category
	const onUpdate = (taskCategoryId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpCategory({
				taskCategoryId,
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
								{dataTaskCategories?.taskCategories &&
									dataTaskCategories.taskCategories.map((taskCategory) => (
										<Tr key={taskCategory.id}>
											<Td>{taskCategory.id}</Td>
											<Td>
												<Editable defaultValue={taskCategory.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(e: any) => {
															onUpdate(
																taskCategory.id,
																taskCategory.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(taskCategory.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleTaskCategory === 'running' || statusUpTaskCategory === 'running') && (
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
								isLoading={statusCreTaskCategory === 'running' ? true : false}
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
