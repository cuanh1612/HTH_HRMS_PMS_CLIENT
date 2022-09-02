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
import { createWorkExperienceMutation, deleteWorkExperienceMutation, updateWorkExperienceMutation } from 'mutations/workexperience'
import { useRouter } from 'next/router'
// import { allJobTypesQuery } from 'queries/jobType'
import { allWorkExperiencesQuery } from 'queries/workExperience'
import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export default function WorkExperiences() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreWorkExperience, { status: statusCreWorkExperience, data: dataCreWorkExperience }] =
		createWorkExperienceMutation(setToast)
	const [mutateDeleWorkExperience, { status: statusDeleWorkExperience, data: dataDeleWorkExperience }] =
		deleteWorkExperienceMutation(setToast)
	const [mutateUpWorkExperience, { status: statusUpWorkExperience, data: dataUpWorkExperience }] =
		updateWorkExperienceMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataWorkExperience, mutate: refetchWorkExperience } = allWorkExperiencesQuery(isAuthenticated)

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
		switch (statusCreWorkExperience) {
			case 'success':
				refetchWorkExperience()
				if (dataCreWorkExperience) {
					setToast({
						type: statusCreWorkExperience,
						msg: dataCreWorkExperience?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreWorkExperience])

	//Refetch data skill and notice when delete success
	useEffect(() => {
		switch (statusDeleWorkExperience) {
			case 'success':
				refetchWorkExperience()
				if (dataDeleWorkExperience) {
					setToast({
						type: statusDeleWorkExperience,
						msg: dataDeleWorkExperience?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleWorkExperience])

	//Refetch data skill and notice when update success
	useEffect(() => {
		switch (statusUpWorkExperience) {
			case 'success':
				refetchWorkExperience()
				if (dataUpWorkExperience) {
					setToast({
						type: statusUpWorkExperience,
						msg: dataUpWorkExperience?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpWorkExperience])

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
			mutateCreWorkExperience({
				name,
			})
			setName('')
		}
	}

	//Handle delete location
	const onDelete = (skillId: number) => {
		mutateDeleWorkExperience(skillId)
	}

	//Handle update location
	const onUpdate = (workExperienceId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpWorkExperience({
				name: newName,
				workExperienceId,
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
									<Th>Work Experience (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataWorkExperience?.workExperiences &&
									dataWorkExperience.workExperiences.map((workExperience) => (
										<Tr key={workExperience.id}>
											<Td>{workExperience.id}</Td>
											<Td>
												<Editable defaultValue={workExperience.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(
															e: ChangeEvent<HTMLInputElement>
														) => {
															onUpdate(
																workExperience.id,
																workExperience.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(workExperience.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleWorkExperience === 'running' || statusUpWorkExperience === 'running') && (
							<Loading />
						)}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Work Experience</Text>
						<HStack w={'full'}>
							<Input
								type={'text'}
								placeholder="Enter name work experience"
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
								isLoading={statusCreWorkExperience === 'running' ? true : false}
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
