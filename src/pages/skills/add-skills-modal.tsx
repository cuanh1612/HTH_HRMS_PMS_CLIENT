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
import { ButtonIcon, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
// import {
// 	createDepartmentMutation,
// 	deleteDepartmentMutation,
// 	updateDepartmentMutation,
// } from 'mutations'
import { createSkillsMutation, deleteSkillMutation, updateSkillMutation } from 'mutations/skill'
import { useRouter } from 'next/router'
// import { allDepartmentsQuery } from 'queries'
import { allSkillsQuery } from 'queries/skill'
import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export interface IAddSkillModalProps {}

export default function AddSkillModal({}: IAddSkillModalProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreSkill, { status: statusCreSkill, data: dataCreSkill }] =
		createSkillsMutation(setToast)
	const [mutateDeleSkill, { status: statusDeleSkill, data: dataDeleSkill }] =
		deleteSkillMutation(setToast)
	const [mutateUpSkill, { status: statusUpSkill, data: dataUpSkill }] =
		updateSkillMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataSkills, mutate: refetchSkills } = allSkillsQuery(isAuthenticated)

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
		switch (statusCreSkill) {
			case 'success':
				refetchSkills()
				if (dataCreSkill) {
					setToast({
						type: 'success',
						msg: dataCreSkill?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreSkill])

	//Refetch data skill and notice when delete success
	useEffect(() => {
		switch (statusDeleSkill) {
			case 'success':
				refetchSkills()
				if (dataDeleSkill) {
					setToast({
						type: 'success',
						msg: dataDeleSkill?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleSkill])

	//Refetch data skill and notice when update success
	useEffect(() => {
		switch (statusUpSkill) {
			case 'success':
				refetchSkills()
				if (dataUpSkill) {
					setToast({
						type: 'success',
						msg: dataUpSkill?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpSkill])

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
			mutateCreSkill({
				skills: [name]
			})
			setName('')
		}
	}

	//Handle delete skill
	const onDelete = (skillId: number) => {
		mutateDeleSkill(skillId)
	}

	//Handle update skill
	const onUpdate = (skillId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpSkill({
				name: newName,
				skillId
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
									<Th>Skill (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataSkills?.skills &&
									dataSkills.skills.map((skill) => (
										<Tr key={skill.id}>
											<Td>{skill.id}</Td>
											<Td>
												<Editable defaultValue={skill.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(
															e: ChangeEvent<HTMLInputElement>
														) => {
															onUpdate(
																skill.id,
																skill.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(skill.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleSkill === 'running' ||
							statusUpSkill === 'running') && <Loading />}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Skill</Text>
						<HStack w={'full'}>
							<Input
								type={'text'}
								placeholder="Enter name skill"
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
								isLoading={statusCreSkill === 'running' ? true : false}
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
