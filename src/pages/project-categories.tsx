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
	VStack
} from '@chakra-ui/react'
import ButtonIcon from 'components/ButtonIcon'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import {
	createProjectCategoryMutation,
	deleteProjectCategoryMutation,
	updateProjectCategoryMutation
} from 'mutations'
import { useRouter } from 'next/router'
import { allProjectCategoriesQuery } from 'queries/projectCategory'
import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export interface IProjectCategoryProps {}

export default function ProjectCategory({}: IProjectCategoryProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [
		mutateCreProjectCategory,
		{ status: statusCreProjectCategory, data: dataCreProjectCategory },
	] = createProjectCategoryMutation(setToast)
	const [
		mutateDeleProjectCategory,
		{ status: statusDeleProjectCategory, data: dataDeleProjectCategory },
	] = deleteProjectCategoryMutation(setToast)
	const [
		mutateUpProjectCategory,
		{ status: statusUpProjectCategory, data: dataUpProjectCategory },
	] = updateProjectCategoryMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataProjectCategories, mutate: refetchProjectCategories } =
		allProjectCategoriesQuery(isAuthenticated)

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
		switch (statusCreProjectCategory) {
			case 'success':
				refetchProjectCategories()
				if (dataCreProjectCategory) {
					setToast({
						type: 'success',
						msg: dataCreProjectCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreProjectCategory])

	//Refetch data project category and notice when delete success
	useEffect(() => {
		switch (statusDeleProjectCategory) {
			case 'success':
				refetchProjectCategories()
				if (dataDeleProjectCategory) {
					setToast({
						type: 'success',
						msg: dataDeleProjectCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleProjectCategory])

	//Refetch data project category and notice when update success
	useEffect(() => {
		switch (statusUpProjectCategory) {
			case 'success':
				refetchProjectCategories()
				if (dataUpProjectCategory) {
					setToast({
						type: 'success',
						msg: dataUpProjectCategory?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpProjectCategory])

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
			mutateCreProjectCategory({
				name,
			})
			setName('')
		}
	}

	//Handle delete project category
	const onDelete = (projectCategoryId: number) => {
		mutateDeleProjectCategory({
			projectCategoryId,
		})
	}

	//Handle update project category
	const onUpdate = (projectCategoryId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpProjectCategory({
				projectCategoryId,
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
									<Th>Project Category (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataProjectCategories?.projectCategories &&
									dataProjectCategories.projectCategories.map(
										(projectCategory) => (
											<Tr key={projectCategory.id}>
												<Td>{projectCategory.id}</Td>
												<Td>
													<Editable defaultValue={projectCategory.name}>
														<EditablePreview />
														<EditableInput
															paddingLeft={2}
															onBlur={(
																e: ChangeEvent<HTMLInputElement>
															) => {
																onUpdate(
																	projectCategory.id,
																	projectCategory.name,
																	e.target.value
																)
															}}
														/>
													</Editable>
												</Td>
												<Td isNumeric>
													<ButtonIcon
														ariaLabel="button-delete"
														handle={() => onDelete(projectCategory.id)}
														icon={<MdDeleteOutline />}
													/>
												</Td>
											</Tr>
										)
									)}
							</Tbody>
						</Table>
						{(statusDeleProjectCategory === 'running' ||
							statusUpProjectCategory === 'running') && <Loading />}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Project Category</Text>
						<HStack w={'full'}>
							<Input
								type={'text'}
								placeholder="Enter name Project Category"
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
								isLoading={statusCreProjectCategory === 'running' ? true : false}
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
