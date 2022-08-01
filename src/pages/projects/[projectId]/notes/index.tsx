import {
	Box,
	Button,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input, Select } from 'components/filter'
import { ProjectLayout } from 'components/layouts'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import {
	deleteProjectNoteMutation,
	deleteProjectNotesMutation,
	reEnterPasswordMutation,
} from 'mutations'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { allProjectNotesQuery, detailProjectQuery } from 'queries'
import { FormEventHandler, useContext, useEffect, useState } from 'react'
import {
	AiOutlineCheck,
	AiOutlineDelete,
	AiOutlineSearch,
} from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import { projectMutationResponse } from 'type/mutationResponses'
import { IFilter, TColumn } from 'type/tableTypes'
import { projectNotesColumn } from 'utils/columns'
import AddNote from './add-notes'
import DetailProjectNote from './[noteId]'
import UpdateNote from './[noteId]/update-note'

const Notes: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast, socket } =
		useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//state -------------------------------------------------------------
	const [projectNoteId, setProjectNoteId] = useState<number>(1)
	// is reset table
	const [isResetFilter, setIsReset] = useState(false)
	const [password, setPassword] = useState<string>('')
	// set loading table
	const [isLoading, setIsLoading] = useState(true)
	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})
	// set isOpen of dialog to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataAllNotes, mutate: refetchAllNotes } = allProjectNotesQuery(
		isAuthenticated,
		projectId as string
	)

	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)

	//Mutation ----------------------------------------------------------
	const [mutateReEnterPassword, { status: statusReEnterPassword }] =
		reEnterPasswordMutation(setToast)

	const [deleteOne, { status: statusDeleteOne, data: dataDl }] = deleteProjectNoteMutation(setToast)
	const [deleteMany, { status: statusDeleteMany, data: dataDlMany}] = deleteProjectNotesMutation(setToast)

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

	useEffect(() => {
		if (statusDeleteOne == 'success' && dataDl) {
			setToast({
				msg: dataDl.message,
				type: statusDeleteOne,
			})
			refetchAllNotes()
		}
	}, [statusDeleteOne])

	useEffect(() => {
		if (statusDeleteMany == 'success' && dataDlMany) {
			setToast({
				msg: dataDlMany.message,
				type: statusDeleteMany,
			})
			refetchAllNotes()
		}
	}, [statusDeleteMany])

	useEffect(() => {
		if (dataAllNotes) {
			setIsLoading(false)
		}
	}, [dataAllNotes])

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

	// header ----------------------------------------
	const columns: TColumn[] = projectNotesColumn({
		currentUser,
		onDelete: (id: number) => {
			setProjectNoteId(id)
			onOpenDl()
		},
		onDetail: ({ id, askPassword }: { id: number; askPassword: boolean }) => {
			setProjectNoteId(id)
			onOpenDetailProjectNote(askPassword)
		},
		onUpdate: (id: number) => {
			setProjectNoteId(id)
			onOpenUpdateNote()
		},
		project_Admin: dataDetailProject?.project?.project_Admin,
	})

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
	const onChangePassword = (value: string) => {
		setPassword(value)
	}

	return (
		<Box pb={8}>
						<Head> 
				<title>Huprom - Notes of project {projectId}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<FuncCollapse>
				{((currentUser && currentUser.role === 'Admin') ||
					(currentUser &&
						dataDetailProject?.project?.project_Admin &&
						currentUser.email === dataDetailProject.project.project_Admin.email)) && (
					<>
						<Func
							icon={<IoAdd />}
							description={'Add new note by form'}
							title={'Add new'}
							action={onOpenAddNote}
						/>

						<Func
							icon={<VscFilter />}
							description={'Open draw to filter'}
							title={'filter'}
							action={onOpenFilter}
						/>
						<Func
							icon={<AiOutlineDelete />}
							title={'Delete all'}
							description={'Delete all notes you selected'}
							action={onOpenDlMany}
							disabled={!dataSl || dataSl.length == 0 ? true : false}
						/>
					</>
				)}
			</FuncCollapse>

			<Table
				data={dataAllNotes?.projectNotes || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser && currentUser.role === 'Admin' ? true : false}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
				disableColumns={['project_category']}
			/>

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
				<UpdateNote onCloseDrawer={onCloseUpdateNote} noteIdProp={projectNoteId} />
			</Drawer>

			{/* drawer to view detail */}
			<Drawer
				size="xl"
				title="Project Note Details"
				onClose={onCloseDetailNote}
				isOpen={isOpenDetailNote}
			>
				<DetailProjectNote noteIdProp={projectNoteId} />
			</Drawer>

			<Drawer
				isOpen={isOpenFilter}
				onClose={onCloseFilter}
				size={'xs'}
				title="Filter"
				footer={
					<Button
						onClick={() => {
							setIsReset(true)
							setTimeout(() => {
								setIsReset(false)
							}, 1000)
						}}
					>
						reset
					</Button>
				}
			>
				<VStack p={6} spacing={5}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'title'}
						label="Title note"
						placeholder="Enter project name"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>
					<Select
						options={[
							{
								label: 'Private',
								value: 'Private',
							},
							{
								label: 'Public',
								value: 'Public',
							},
						]}
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'note_type'}
						label="Status"
						placeholder="Select status"
					/>
				</VStack>
			</Drawer>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					deleteOne(String(projectNoteId))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsLoading(true)
						deleteMany(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

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
						<Input
							type={'text'}
							placeholder="Please Enter Your Password"
							defaultValue={password}
							handleSearch={(e: IFilter) => {
								console.log(e.filterValue)
								onChangePassword(e.filterValue)
							}}
							label={'Password'}
							required={true}
							columnId={'password'}
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
		</Box>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	//Get access token
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
	const checkAssignedProject: projectMutationResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-assigned`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!checkAssignedProject.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {},
	}
}

Notes.getLayout = ProjectLayout
export default Notes
