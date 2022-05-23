import { Box, Button, HStack, Input, Text, useDisclosure, VStack } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { reEnterPasswordMutation } from 'mutations/auth'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allProjectNotesQuery } from 'queries/projectNote'
import { FormEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { projectMutaionResponse } from 'type/mutationResponses'
import AddNote from './add-notes'
import DetailProjectNote from './[noteId]'
import UpdateNote from './[noteId]/update-note'

export interface INotesProps {}

export default function Notes({}: INotesProps) {
	const { isAuthenticated, handleLoading, currentUser, setToast, socket } =
		useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//state -------------------------------------------------------------
	const [projectNoteIdShow, setProjectNoteIdShow] = useState<number>(1)
	const [password, setPassword] = useState<string>('')

	//Query -------------------------------------------------------------
	const { data: dataAllNotes, mutate: refetchAllNotes } = allProjectNotesQuery(
		isAuthenticated,
		projectId as string
	)

	//Mutation ----------------------------------------------------------
	const [mutateReEnterPassword, { status: statusReEnterPassword }] =
		reEnterPasswordMutation(setToast)

	//Modal -------------------------------------------------------------
	// set open add notes
	const {
		isOpen: isOpenAddNote,
		onOpen: onOpenAddNote,
		onClose: onCloseAddNote,
	} = useDisclosure()

	// set open update notes
	const {
		isOpen: isOpenUpdateNote,
		onOpen: onOpenUpdateNote,
		onClose: onCloseUpdateNote,
	} = useDisclosure()

	// set open view detail note
	const {
		isOpen: isOpenDetailNote,
		onOpen: onOpenDetailNote,
		onClose: onCloseDetailNote,
	} = useDisclosure()

	// set open modal re-enter password
	const {
		isOpen: isOpenReEnterPassword,
		onOpen: onOpenReEnterPassword,
		onClose: onCloseReEnterPassword,
	} = useDisclosure()

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

	//Notice when check password success
	useEffect(() => {
		switch (statusReEnterPassword) {
			case 'success':
				setPassword('')
				onCloseReEnterPassword()
				onOpenDetailNote()
				break

			default:
				break
		}
	}, [statusReEnterPassword])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && projectId) {
			socket.emit('joinRoomProjectNote', projectId)

			socket.on('getNewProjectNote', () => {
				refetchAllNotes()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && projectId) {
				socket.emit('leaveRoomProjectNote', projectId)
			}
		}

		return leaveRoom
	}, [socket, projectId])

	//Function -----------------------------------------------------------
	//handle open detail note
	const onOpenDetailProjectNote = (ask_re_password: boolean) => {
		console.log(ask_re_password)

		if (ask_re_password) {
			onOpenReEnterPassword()
		} else {
			onOpenDetailNote()
		}
	}

	//handle check re enter password
	const onSubmitCheckPassword: FormEventHandler<HTMLDivElement> &
		FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()

		if (!currentUser) {
			setToast({
				msg: 'Please Login First',
				type: 'error',
			})
		} else {
			mutateReEnterPassword({
				email: currentUser?.email,
				password: password,
			})
		}
	}

	//Handle change password
	const onChangePassword = (value: any) => {
		setPassword(value.target.value as string)
	}

	return (
		<>
			<Button onClick={onOpenAddNote}>Show add note</Button>
			<Button onClick={onOpenUpdateNote}>Show update note</Button>

			{dataAllNotes?.projectNotes &&
				dataAllNotes.projectNotes.map((projectNote) => (
					<HStack key={projectNote.id}>
						<Text>{projectNote.title}</Text>
						{projectNote.note_type === 'Public' ||
						(currentUser && currentUser.role === 'Admin') ||
						(currentUser && currentUser.role === 'Client') ? (
							<Button
								onClick={() => {
									setProjectNoteIdShow(projectNote.id)
									onOpenDetailProjectNote(projectNote.ask_re_password)
								}}
							>
								View
							</Button>
						) : (
							projectNote.employees &&
							currentUser?.role === 'employee' &&
							projectNote.employees.some(
								(employeeItem) => employeeItem.id === currentUser.id
							) && (
								<Button
									onClick={() => {
										setProjectNoteIdShow(projectNote.id)
										onOpenDetailProjectNote(projectNote.ask_re_password)
									}}
								>
									View
								</Button>
							)
						)}
					</HStack>
				))}

			{/* drawer to add project note */}
			<Drawer size="xl" title="Add Note" onClose={onCloseAddNote} isOpen={isOpenAddNote}>
				<AddNote onCloseDrawer={onCloseAddNote} />
			</Drawer>

			{/* drawer to update project note */}
			<Drawer
				size="xl"
				title="Update Note"
				onClose={onCloseUpdateNote}
				isOpen={isOpenUpdateNote}
			>
				<UpdateNote onCloseDrawer={onCloseUpdateNote} noteIdProp={4} />
			</Drawer>

			{/* drawer to view detail */}
			<Drawer
				size="xl"
				title="Project Note Details"
				onClose={onCloseDetailNote}
				isOpen={isOpenDetailNote}
			>
				<DetailProjectNote noteIdProp={projectNoteIdShow} />
			</Drawer>

			{/* Modal reenter password */}
			<Modal
				size="3xl"
				isOpen={isOpenReEnterPassword}
				onOpen={onOpenReEnterPassword}
				onClose={onCloseReEnterPassword}
				title="Re-Enter Password"
			>
				<Box paddingInline={6} as={'form'} onSubmit={onSubmitCheckPassword}>
					<VStack align={'start'}>
						<Text color={'gray.400'}>
							Password <span style={{ color: 'red' }}>*</span>
						</Text>
						<Input
							type={'text'}
							required
							placeholder="Plear Enter Your Password"
							defaultValue={password}
							onChange={(e: any) => onChangePassword(e)}
						/>
						<VStack align={'end'} w="full">
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
								isLoading={statusReEnterPassword === 'running' ? true : false}
							>
								Check
							</Button>
						</VStack>
					</VStack>
				</Box>
			</Modal>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	//Get accesstoken
	const getAccessToken: { accessToken: string; code: number; message: string; success: boolean } =
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh_token`, {
			method: 'GET',
			headers: {
				cookie: context.req.headers.cookie,
			} as HeadersInit,
		}).then((e) => e.json())

	//Redirect login page when error
	if (getAccessToken.code !== 200) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}

	//Check assigned
	const checkAsignedProject: projectMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-asigned`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!checkAsignedProject.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {},
	}
}
