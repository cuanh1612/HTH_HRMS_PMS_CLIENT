import { Box, Button, Grid, GridItem, Text, useColorMode, VStack } from '@chakra-ui/react'
import { Editor, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createProjectDiscussionReplyMutation } from 'mutations'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allRepliesByDiscussionQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { projectMutationResponse } from 'type/mutationResponses'

export interface IAddReplyProps {
	discussionId: string | number
	projectId: string | number
	onCloseModal?: () => void
}

export default function AddReply({ discussionId, projectId, onCloseModal }: IAddReplyProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const {colorMode} = useColorMode()
	const router = useRouter()

	//State --------------------------------------------------------------
	const [reply, setReply] = useState<string>('')

	//Query --------------------------------------------------------------
	//Get all replies of this discussion
	const { mutate: refetchAllReplies } = allRepliesByDiscussionQuery(
		isAuthenticated,
		discussionId as string
	)

	//Mutation -----------------------------------------------------------
	const [
		mutateCreProjectDiscussionReplyType,
		{ status: statusCreProjectDiscussionReplyType, data: dataCreProjectDiscussionReplyType },
	] = createProjectDiscussionReplyMutation(setToast)

	//Function -----------------------------------------------------------
	const onSubmitReply = () => {
		if (!reply || !projectId || !discussionId) {
			setToast({
				msg: 'Please enter full field',
				type: 'warning',
			})
		} else {
			mutateCreProjectDiscussionReplyType({
				reply,
				project: Number(projectId as string),
				project_discussion_room: Number(discussionId as string),
			})
		}
	}

	const onChangeReply = (value: string) => {
		setReply(value)
	}

	//UseEffect ----------------------------------------------------------
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

	//UseEffect ----------------------------------------------------------
	//Notice when create success
	useEffect(() => {
		switch (statusCreProjectDiscussionReplyType) {
			case 'success':
				if (dataCreProjectDiscussionReplyType) {
					//Notice
					setToast({
						type: 'success',
						msg: dataCreProjectDiscussionReplyType?.message,
					})

					if (socket && discussionId) {
						socket.emit('newProjectDiscussionReply', discussionId)
					}

					//Refetch data all replies
					refetchAllReplies()

					if (onCloseModal) {
						onCloseModal()
					}
				}
				break

			default:
				break
		}
	}, [statusCreProjectDiscussionReplyType])

	return (
		<Box>
			<VStack align={'start'}>
				<Box w="full" paddingInline={6}>
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'}>
								<Text fontWeight={'normal'} color={'gray.400'}>
									Reply{' '}
									<Text
										ml={1}
										display={'inline-block'}
										color={colorMode ? 'red.300' : 'red.500'}
									>
										*
									</Text>
								</Text>
								<Editor note={reply} onChangeNote={onChangeReply} />
							</VStack>
						</GridItem>
					</Grid>

					<VStack align={'end'}>
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
							onClick={onSubmitReply}
						>
							Save
						</Button>
					</VStack>
					{statusCreProjectDiscussionReplyType === 'running' && <Loading />}
				</Box>
			</VStack>
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
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-asigned`,
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
