import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Grid,
	GridItem,
	HStack,
	Radio,
	RadioGroup,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, SelectMany } from 'components/form'
import { Editor, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { updateProjectNoteMutation } from 'mutations'
import { useRouter } from 'next/router'
import { detailProjectQuery, allProjectNotesQuery, detailProjectNoteRoomQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdOutlineSubtitles } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { updateProjectNoteForm } from 'type/form/basicFormType'
import { UpdateProjectNoteValidate } from 'utils/validate'

export interface IUpdateNoteProps {
	onCloseDrawer?: () => void
	noteIdProp?: string | number
}

export default function UpdateNote({ onCloseDrawer, noteIdProp }: IUpdateNoteProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const router = useRouter()
	const { noteId: noteIdRouter, projectId } = router.query

	//State ----------------------------------------------------------------------
	const [detail, setDetail] = useState<string>('')
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [selectedOptionEmployees, setSelectedOptionEmployees] = useState<IOption[]>([])
	const [noteType, setNoteType] = useState<'Public' | 'Private'>('Public')
	const [visibleToClient, setVisibleToClient] = useState<boolean>(false)
	const [askRePassword, setAskRePassword] = useState<boolean>(false)

	//query ----------------------------------------------------------------------
	// get data detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)

	//Get detail project note
	const { data: dataDetailNote } = detailProjectNoteRoomQuery(
		isAuthenticated,
		Number(noteIdProp || noteIdRouter)
	)

	const { mutate: refetchAllNotes } = allProjectNotesQuery(isAuthenticated, projectId as string)

	//mutation -------------------------------------------------------------------
	const [mutateUpProjectNote, { status: statusUpProjectNote, data: dataUpProjectNote }] =
		updateProjectNoteMutation(setToast)

	// setForm and submit form update project note -------------------------------
	const formSetting = useForm<updateProjectNoteForm>({
		defaultValues: {
			title: '',
			employees: [],
		},
		resolver: yupResolver(UpdateProjectNoteValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateProjectNoteForm) => {
		if (!projectId) {
			setToast({
				msg: 'Not found project to update project note',
				type: 'error',
			})
		} else {
			values.detail = detail
			values.visible_to_client = visibleToClient
			values.ask_re_password = askRePassword
			values.note_type = noteType
			values.project = Number(projectId)
			await mutateUpProjectNote({
				inputCreate: values,
				projectNoteId: noteIdProp || (noteIdRouter as string),
			})
		}
	}

	//Function -------------------------------------------------------------------
	const onChangeDetail = (value: string) => {
		setDetail(value)
	}

	//User effect ---------------------------------------------------------------
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

	//Set data form when have data detail note
	useEffect(() => {
		if (dataDetailNote && dataDetailNote.projectNote) {
			setDetail(dataDetailNote.projectNote?.detail || '')
			setVisibleToClient(dataDetailNote.projectNote.visible_to_client || false)
			setAskRePassword(dataDetailNote.projectNote.ask_re_password || false)
			setNoteType((dataDetailNote.projectNote.note_type as 'Public' | 'Private') || 'Public')

			formSetting.reset({
				title: dataDetailNote.projectNote.title || '',
				employees:
					dataDetailNote.projectNote.employees?.map((employee) => employee.id) || [],
			})

			if (dataDetailNote.projectNote.employees) {
				const newSelectedOptionEmployees: IOption[] = []

				dataDetailNote.projectNote.employees.map((employee) => {
					newSelectedOptionEmployees.push({
						label: (
							<>
								<HStack>
									<Avatar
										size={'xs'}
										name={employee.name}
										src={employee.avatar?.url}
									/>
									<Text>{employee.email}</Text>
								</HStack>
							</>
						),
						value: employee.id,
					})
				})

				setSelectedOptionEmployees(newSelectedOptionEmployees)
			}
		}
	}, [dataDetailNote])

	//Set data option employees state
	useEffect(() => {
		if (dataDetailProject && dataDetailProject.project?.employees) {
			const newOptionEmployees: IOption[] = []

			dataDetailProject.project.employees.map((employee) => {
				newOptionEmployees.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text>{employee.email}</Text>
							</HStack>
						</>
					),
					value: employee.id,
				})
			})

			setOptionEmployees(newOptionEmployees)
		}
	}, [dataDetailProject])

	//Note when request success
	useEffect(() => {
		if (statusUpProjectNote === 'success') {
			if (socket && projectId) {
				socket.emit('newProjectNote', projectId)
			}

			refetchAllNotes()

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: statusUpProjectNote,
				msg: dataUpProjectNote?.message as string,
			})
		}
	}, [statusUpProjectNote])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="title"
							label="Note Title"
							icon={
								<MdOutlineSubtitles fontSize={'20px'} color="gray" opacity={0.6} />
							}
							form={formSetting}
							placeholder="Enter Note Title"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack align={'start'}>
							<Text>Note Type</Text>
							<RadioGroup
								onChange={(value: 'Public' | 'Private') => setNoteType(value)}
								value={noteType}
							>
								<Stack direction="row">
									<Radio value="Public">Public</Radio>
									<Radio value="Private">Private</Radio>
								</Stack>
							</RadioGroup>
						</VStack>
					</GridItem>

					{noteType === 'Private' && (
						<>
							<GridItem w="100%" colSpan={[2]}>
								<SelectMany
									placeholder='Select employees'
									form={formSetting}
									label={'Employees'}
									name={'employees'}
									required={true}
									options={optionEmployees}
									selectedOptions={selectedOptionEmployees}
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<Checkbox
									isChecked={visibleToClient}
									onChange={() => setVisibleToClient(!visibleToClient)}
								>
									Visible To Client
								</Checkbox>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<Checkbox
									isChecked={askRePassword}
									onChange={() => setAskRePassword(!askRePassword)}
								>
									Ask to re-enter password
								</Checkbox>
							</GridItem>
						</>
					)}

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Note Detail
							</Text>
							<Editor note={detail} onChangeNote={onChangeDetail} />
						</VStack>
					</GridItem>
				</Grid>

				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					transform="auto"
					_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
					_active={{
						bg: 'hu-Green.normalA',
						scale: 1,
					}}
					leftIcon={<AiOutlineCheck />}
					mt={6}
					type="submit"
				>
					Save
				</Button>
				{statusUpProjectNote == 'running' && <Loading />}
			</Box>
		</>
	)
}
