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
	createContractTypeMutation,
	deleteContractTypeMutation,
	updateContractTypeMutation,
} from 'mutations/contractType'
import { useRouter } from 'next/router'
import { allContractTypesQuery } from 'queries/contractType'
import { ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export interface IDepartmentProps {}

export default function ContractTypes(props: IDepartmentProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreContractType, { status: statusCreContractType, data: dataCreContractType }] =
		createContractTypeMutation(setToast)
	const [mutateDeleContractType, { status: statusDeleContractType, data: dataDeleContractType }] =
		deleteContractTypeMutation(setToast)
	const [mutateUpContractType, { status: statusUpContractType, data: dataUpContractType }] =
		updateContractTypeMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataContractTypes, mutate: refetchContractTypes } = allContractTypesQuery()

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
		switch (statusCreContractType) {
			case 'success':
				refetchContractTypes()
				if (dataCreContractType) {
					setToast({
						type: 'success',
						msg: dataCreContractType?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreContractType])

	//Refetch data department and notice when delete success
	useEffect(() => {
		switch (statusDeleContractType) {
			case 'success':
				refetchContractTypes()
				if (dataDeleContractType) {
					setToast({
						type: 'success',
						msg: dataDeleContractType?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleContractType])

	//Refetch data department and notice when update success
	useEffect(() => {
		switch (statusUpContractType) {
			case 'success':
				refetchContractTypes()
				if (dataUpContractType) {
					setToast({
						type: 'success',
						msg: dataUpContractType?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpContractType])

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
			mutateCreContractType({
				name,
			})
			setName('')
		}
	}

	//Handle delete contract type
	const onDelete = (contractTypeId: number) => {
		mutateDeleContractType({
			contractTypeId,
		})
	}

	//Handle update contract type
	const onUpdate = (contractTypeId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpContractType({
				contractTypeId,
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
									<Th>Contract Type (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataContractTypes?.contractTypes &&
									dataContractTypes.contractTypes.map((contractType) => (
										<Tr key={contractType.id}>
											<Td>{contractType.id}</Td>
											<Td>
												<Editable defaultValue={contractType.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(e) => {
															onUpdate(
																contractType.id,
																contractType.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(contractType.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleContractType === 'running' ||
							statusUpContractType === 'running') && <Loading />}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Department</Text>
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
								isLoading={statusCreContractType === 'running' ? true : false}
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
