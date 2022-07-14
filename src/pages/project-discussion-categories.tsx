import {
	Box,
	Button,
	Divider,
	Editable,
	EditableInput,
	EditablePreview,
	Grid,
	GridItem,
	Input,
	Stack,
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
	createProjectDiscussionCategoryMutation,
	deleteProjectDiscussionCategoryMutation,
	updateProjectDiscussionCategoryMutation,
} from 'mutations'
import { useRouter } from 'next/router'
import { allProjectDiscussionCategoryQuery } from 'queries'
import { ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'


export default function ProjectDiscussionCategory() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')
	const [color, setColor] = useState('#16813D')

	//Mutation ----------------------------------------------------------
	const [
		mutateCreDiscussionCategory,
		{ status: statusCreDiscussionCategory, data: dataCreDiscussionCategory },
	] = createProjectDiscussionCategoryMutation(setToast)
	const [
		mutateDeleDiscussionCategory,
		{ status: statusDeleDiscussionCategory, data: dataDeleDiscussionCategory },
	] = deleteProjectDiscussionCategoryMutation(setToast)
	const [
		mutateUpDiscussionCategory,
		{ status: statusUpDiscussionCategory, data: dataUpDiscussionCategory },
	] = updateProjectDiscussionCategoryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataDiscussionCategories, mutate: refetchDiscussionCategories } =
		allProjectDiscussionCategoryQuery(isAuthenticated)

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
		switch (statusCreDiscussionCategory) {
			case 'success':
				if (dataCreDiscussionCategory) {
					refetchDiscussionCategories()

					setToast({
						type: statusCreDiscussionCategory,
						msg: dataCreDiscussionCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreDiscussionCategory])

	//Refetch data all discussion categories and notice when delete success
	useEffect(() => {
		switch (statusDeleDiscussionCategory) {
			case 'success':
				if (dataDeleDiscussionCategory) {
					refetchDiscussionCategories()

					setToast({
						type: statusDeleDiscussionCategory,
						msg: dataDeleDiscussionCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleDiscussionCategory])

	//Refetch data all discussion categories and notice when update success
	useEffect(() => {
		switch (statusUpDiscussionCategory) {
			case 'success':
				if (dataUpDiscussionCategory) {
					refetchDiscussionCategories()

					setToast({
						type: statusUpDiscussionCategory,
						msg: dataUpDiscussionCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpDiscussionCategory])

	// Function ----------------------------------------------------------
	const onChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
		setName(e.target.value)
	}

	const onChangeColor: ChangeEventHandler<HTMLInputElement> = (e) => {
		setColor(e.target.value)
	}

	//Handle submit form
	const onSubmit = () => {
		if (!name || !color) {
			setToast({
				type: 'warning',
				msg: 'Please enter full field',
			})
		} else {
			mutateCreDiscussionCategory({
				name,
				color: color,
			})
			setName('')
			setColor('#16813D')
		}
	}

	//Handle delete client sub category
	const onDelete = (discussionCategoryId: number) => {
		mutateDeleDiscussionCategory({
			projectDiscussionCategoryId: discussionCategoryId,
		})
	}

	//Handle update client sub category
	const onUpdate = (
		discussionCategoryId: number,
		oldName: string,
		newName: string,
		oldColor: string,
		newColor: string
	) => {
		if (oldName !== newName || oldColor !== newColor) {
			mutateUpDiscussionCategory({
				projectDiscussionCategoryId: discussionCategoryId,
				name: newName,
				color: newColor,
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
									<Th>Color</Th>
									<Th>Category Name</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataDiscussionCategories?.projectDiscussionCategories &&
									dataDiscussionCategories.projectDiscussionCategories.map(
										(discussionCategory) => (
											<Tr key={discussionCategory.id}>
												<Td>{discussionCategory.id}</Td>
												<Td>
													<Box
														w={4}
														h={4}
														borderRadius={'50%'}
														bgColor={discussionCategory.color}
													></Box>
												</Td>
												<Td>
													<Editable
														defaultValue={discussionCategory.name}
													>
														<EditablePreview />
														<EditableInput
															paddingLeft={2}
															onBlur={(e) => {
																onUpdate(
																	discussionCategory.id,
																	discussionCategory.name,
																	e.target.value,
																	discussionCategory.color,
																	color
																)
															}}
														/>
													</Editable>
												</Td>
												<Td isNumeric>
													<ButtonIcon
														ariaLabel="button-delete"
														handle={() =>
															onDelete(discussionCategory.id)
														}
														icon={<MdDeleteOutline />}
													/>
												</Td>
											</Tr>
										)
									)}
							</Tbody>
						</Table>
						{(statusDeleDiscussionCategory === 'running' ||
							statusUpDiscussionCategory === 'running') && <Loading />}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Stack w="full">
							<Grid templateColumns="repeat(2, 1fr)" gap={6}>
								<GridItem w="100%" colSpan={[2, 1]}>
									<VStack align={'start'}>
										<Text>
											Category Name <span style={{ color: 'red' }}>*</span>
										</Text>

										<Input
											type={'text'}
											placeholder="Enter a category name"
											required
											value={name}
											onChange={onChangeName}
										/>
									</VStack>
								</GridItem>
								<GridItem w="100%" colSpan={[2, 1]}>
									<VStack align={'start'}>
										<Text>
											Color Code <span style={{ color: 'red' }}></span>
										</Text>

										<Input
											type={'color'}
											required
											value={color}
											onChange={onChangeColor}
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
								isLoading={statusCreDiscussionCategory === 'running' ? true : false}
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
