import { Button, Text, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allProjectNotesQuery } from 'queries/projectNote'
import { useContext, useEffect, useState } from 'react'
import { projectMutaionResponse } from 'type/mutationResponses'
import AddNote from './add-notes'
import DetailProjectNote from './[noteId]'

export interface INotesProps {}

export default function Notes({}: INotesProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//state -------------------------------------------------------------
	const [projectNoteIdShow, setProjectNoteIdShow] = useState<number>(1)

	//Query -------------------------------------------------------------
	const { data: dataAllNotes } = allProjectNotesQuery(isAuthenticated, projectId as string)
	console.log(dataAllNotes)

	//Modal -------------------------------------------------------------
	// set open add notes
	const {
		isOpen: isOpenAddNote,
		onOpen: onOpenAddNote,
		onClose: onCloseAddNote,
	} = useDisclosure()

	// set open view detail note
	const {
		isOpen: isOpenDetailNote,
		onOpen: onOpenDetailNote,
		onClose: onCloseDetailNote,
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

	return (
		<>
			<Button onClick={onOpenAddNote}>Show add note</Button>
			<Button onClick={onOpenDetailNote}>View note public</Button>

			{dataAllNotes?.projectNotes &&
				dataAllNotes.projectNotes.map((projectNote) => (
					<Text key={projectNote.id}>{projectNote.title}</Text>
				))}

			{/* drawer to add project note */}
			<Drawer size="xl" title="Add Note" onClose={onCloseAddNote} isOpen={isOpenAddNote}>
				<AddNote onCloseDrawer={onCloseAddNote} />
			</Drawer>

			<Drawer
				size="xl"
				title="Project Note Details"
				onClose={onCloseDetailNote}
				isOpen={isOpenDetailNote}
			>
				<DetailProjectNote noteIdProp={projectNoteIdShow} />
			</Drawer>
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
