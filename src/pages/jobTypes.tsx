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
import { ButtonIcon, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createJobTypeMutation, deleteJobTypeMutation, updateJobTypeMutation } from 'mutations/jobType'
import { useRouter } from 'next/router'
import { allJobTypesQuery } from 'queries/jobType'
import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export default function JobTypes() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreJobType, { status: statusCreJobType, data: dataCreJobType }] =
		createJobTypeMutation(setToast)
	const [mutateDeleJobType, { status: statusDeleJobType, data: dataDeleJobType }] =
		deleteJobTypeMutation(setToast)
	const [mutateUpJobType, { status: statusUpJobType, data: dataUpJobType }] =
		updateJobTypeMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataJobTypes, mutate: refetchJobTypes } = allJobTypesQuery(isAuthenticated)

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
		switch (statusCreJobType) {
			case 'success':
				refetchJobTypes()
				if (dataCreJobType) {
					setToast({
						type: statusCreJobType,
						msg: dataCreJobType?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreJobType])

	//Refetch data skill and notice when delete success
	useEffect(() => {
		switch (statusDeleJobType) {
			case 'success':
				refetchJobTypes()
				if (dataDeleJobType) {
					setToast({
						type: statusDeleJobType,
						msg: dataDeleJobType?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleJobType])

	//Refetch data skill and notice when update success
	useEffect(() => {
		switch (statusUpJobType) {
			case 'success':
				refetchJobTypes()
				if (dataUpJobType) {
					setToast({
						type: statusUpJobType,
						msg: dataUpJobType?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpJobType])

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
			mutateCreJobType({
				name,
			})
			setName('')
		}
	}

	//Handle delete location
	const onDelete = (skillId: number) => {
		mutateDeleJobType(skillId)
	}

	//Handle update location
	const onUpdate = (jobTypeId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpJobType({
				name: newName,
				jobTypeId,
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
									<Th>Job Type (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataJobTypes?.jobTypes &&
									dataJobTypes.jobTypes.map((jobType) => (
										<Tr key={jobType.id}>
											<Td>{jobType.id}</Td>
											<Td>
												<Editable defaultValue={jobType.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(
															e: ChangeEvent<HTMLInputElement>
														) => {
															onUpdate(
																jobType.id,
																jobType.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(jobType.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleJobType === 'running' || statusUpJobType === 'running') && (
							<Loading />
						)}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Job Type</Text>
						<HStack w={'full'}>
							<Input
								type={'text'}
								placeholder="Enter name job type"
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
								isLoading={statusCreJobType === 'running' ? true : false}
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
