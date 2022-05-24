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
	createDepartmentMutation,
	deleteDepartmentMutation,
	updateDepartmentMutation,
} from 'mutations'
import { useRouter } from 'next/router'
import { allDepartmentsQuery } from 'queries'
import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export interface IDepartmentProps {}

export default function Department({}: IDepartmentProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreDepartment, { status: statusCreDepartment, data: dataCreDepartment }] =
		createDepartmentMutation(setToast)
	const [mutateDeleDepartment, { status: statusDeleDepartment, data: dataDeleDepartment }] =
		deleteDepartmentMutation(setToast)
	const [mutateUpDepartment, { status: statusUpDepartment, data: dataUpDepartment }] =
		updateDepartmentMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataDepartments, mutate: refetchDepartments } =
		allDepartmentsQuery(isAuthenticated)

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
		switch (statusCreDepartment) {
			case 'success':
				refetchDepartments()
				if (dataCreDepartment) {
					setToast({
						type: 'success',
						msg: dataCreDepartment?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreDepartment])

	//Refetch data department and notice when delete success
	useEffect(() => {
		switch (statusDeleDepartment) {
			case 'success':
				refetchDepartments()
				if (dataDeleDepartment) {
					setToast({
						type: 'success',
						msg: dataDeleDepartment?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleDepartment])

	//Refetch data department and notice when update success
	useEffect(() => {
		switch (statusUpDepartment) {
			case 'success':
				refetchDepartments()
				if (dataUpDepartment) {
					setToast({
						type: 'success',
						msg: dataUpDepartment?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpDepartment])

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
			mutateCreDepartment({
				name,
			})
			setName('')
		}
	}

	//Handle delete department
	const onDelete = (departmentId: number) => {
		mutateDeleDepartment({
			departmentId,
		})
	}

	//Handle update department
	const onUpdate = (departmentId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpDepartment({
				departmentId,
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
									<Th>Department (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataDepartments?.departments &&
									dataDepartments.departments.map((department) => (
										<Tr key={department.id}>
											<Td>{department.id}</Td>
											<Td>
												<Editable defaultValue={department.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(e: ChangeEvent<HTMLInputElement>) => {
															onUpdate(
																department.id,
																department.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(department.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleDepartment === 'running' ||
							statusUpDepartment === 'running') && <Loading />}
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
								isLoading={statusCreDepartment === 'running' ? true : false}
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
