import { Avatar, Box, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allProjectNotesQuery, detailProjectNoteRoomQuery } from 'queries/projectNote'
import { useContext, useEffect } from 'react'
import { projectMutaionResponse } from 'type/mutationResponses'

export interface IDetailNoteProps {
	noteIdProp?: number
}

export default function DetailProjectNote({ noteIdProp }: IDetailNoteProps) {
	const { isAuthenticated, handleLoading, socket } = useContext(AuthContext)
	const router = useRouter()
	const { noteId: noteIdRouter, projectId } = router.query

	//query ---------------------------------------------------------------------
	//Get detail project note
	const { data: dataDetailNote } = detailProjectNoteRoomQuery(
		isAuthenticated,
		Number(noteIdProp || noteIdRouter)
	)

	//User effect ---------------------------------------------------------------
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
			<Box pos="relative" p={6} h="auto" as={'form'}>
				<VStack pos="relative" align={'start'} spacing={4}>
					<Text fontWeight={'semibold'}>
						Project Note Detail #{dataDetailNote?.projectNote?.id}
					</Text>
					<Grid w={'full'} templateColumns="repeat(3, 1fr)" gap={7}>
						<GridItem colSpan={[3, 1]} color={'gray.400'}>
							Note Title:
						</GridItem>
						<GridItem colSpan={[3, 2]}>{dataDetailNote?.projectNote?.title}</GridItem>
						<GridItem colSpan={[3, 1]} color={'gray.400'}>
							Note Type:
						</GridItem>
						<GridItem colSpan={[3, 2]}>
							{dataDetailNote?.projectNote?.note_type}
						</GridItem>
						<GridItem colSpan={[3, 1]} color={'gray.400'}>
							Assigned To:
						</GridItem>
						<GridItem colSpan={[3, 2]}>
							<HStack wrap={'wrap'}>
								{dataDetailNote?.projectNote?.employees &&
								dataDetailNote.projectNote.employees.length > 0 ? (
									dataDetailNote.projectNote.employees.map((employee) => (
										<Avatar
											size={'xs'}
											src={employee.avatar?.url}
											name={employee.name}
										/>
									))
								) : (
									<Text color={'red'}>None</Text>
								)}
							</HStack>
						</GridItem>
						<GridItem colSpan={[3, 1]} color={'gray.400'}>
							Visible To Client:
						</GridItem>
						<GridItem colSpan={[3, 2]}>
							{dataDetailNote?.projectNote?.visible_to_client ? 'Yes' : 'No'}
						</GridItem>
						<GridItem colSpan={[3, 1]} color={'gray.400'}>
							Note Detail:
						</GridItem>
						<GridItem colSpan={[3, 2]}>
							<div
								dangerouslySetInnerHTML={{
									__html: dataDetailNote?.projectNote?.detail
										? dataDetailNote?.projectNote?.detail
										: '',
								}}
							/>
						</GridItem>
					</Grid>
				</VStack>
			</Box>
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
