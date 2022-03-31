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
import ButtonIcon from 'components/ButtonIcon'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import {
	createDesignationMutation,
	deleteDesignationMutation,
	updateDesignationMutation,
} from 'mutations/designation'
import { useRouter } from 'next/router'
import { allDesignationsQuery } from 'queries/designation'
import { ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export interface IDepartmentProps {}

export default function Designation(props: IDepartmentProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreDesignation, { status: statusCreDesignation, data: dataCreDesignation }] =
		createDesignationMutation(setToast)
	const [mutateDeleDesignation, { status: statusDeleDesignation, data: dataDeleDesignation }] =
		deleteDesignationMutation(setToast)
	const [mutateUpDesignation, { status: statusUpDesignation, data: dataUpDesignatiton }] =
		updateDesignationMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataDesignations, mutate: refetchDesignations } =
		allDesignationsQuery(isAuthenticated)

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
		switch (statusCreDesignation) {
			case 'success':
				refetchDesignations()
				if (dataCreDesignation) {
					setToast({
						type: 'success',
						msg: dataCreDesignation?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreDesignation])

	useEffect(() => {
		switch (statusDeleDesignation) {
			case 'success':
				refetchDesignations()
				if (dataDeleDesignation) {
					setToast({
						type: 'success',
						msg: dataDeleDesignation?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleDesignation])

	useEffect(() => {
		switch (statusUpDesignation) {
			case 'success':
				refetchDesignations()
				if (dataUpDesignatiton) {
					setToast({
						type: 'success',
						msg: dataUpDesignatiton?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpDesignation])

	// Function ----------------------------------------------------------
	const onChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
		setName(e.target.value)
	}

	//Handle submit form create
	const onSubmit = () => {
		if (!name) {
			setToast({
				type: 'warning',
				msg: 'Please enter full field',
			})
		} else {
			mutateCreDesignation({
				name,
			})
		}
	}

	//Handle delete designation
	const onDelete = (designationId: number) => {
		mutateDeleDesignation({
			designationId,
		})
	}

	//Handle update designation
	const onUpdate = (designationId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpDesignation({
				designationId,
				name: newName,
			})
		}
	}

	return (
		<Box>
			<VStack align={'start'}>
				<Divider />
				<Box maxHeight={'400px'} overflow="auto" w={'full'}>
					<TableContainer w="full" paddingInline={6} pos={'relative'}>
						<Table variant="simple">
							<Thead pos={'sticky'} top={'0px'}>
								<Tr>
									<Th w={'50px'}>#</Th>
									<Th>Department</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataDesignations?.designations &&
									dataDesignations.designations.map((designation) => (
										<Tr key={designation.id}>
											<Td>{designation.id}</Td>
											<Td>
												<Editable defaultValue={designation.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(e) => {
															onUpdate(
																designation.id,
																designation.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(designation.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{statusDeleDesignation === 'running' ||
							(statusUpDesignation === 'running' && <Loading />)}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Designation</Text>
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
								isLoading={statusCreDesignation === 'running' ? true : false}
							>
								Save
							</Button>
						</HStack>
					</VStack>
				</Box>

				<Divider />
			</VStack>
		</Box>
	)
}
