import { Avatar, Box, Grid, GridItem, HStack, Text, useColorMode, useDisclosure, VStack } from '@chakra-ui/react'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allRepliesByDiscussionQuery, detailProjectDiscussionRoomQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { projectMutationResponse } from 'type/mutationResponses'
import AddReply from './add-reply'
import UpdateReply from './update-reply'

export interface IDetailDiscussionProps {
	onCloseDrawer?: () => void
	discussionIdProp?: number
}

export default function DetailDiscussion({ discussionIdProp }: IDetailDiscussionProps) {
	const { isAuthenticated, handleLoading, currentUser, socket } = useContext(AuthContext)
	const router = useRouter()
	const {colorMode} = useColorMode()
	const { discussionId: discussionIdRouter, projectId } = router.query

	//State ---------------------------------------------------------------------
	//ID reply select to update
	const [replyId, setReplyId] = useState<number>()

	//Setup modal ---------------------------------------------------------------
	const {
		isOpen: isOpenAddReply,
		onOpen: onOpenAddReply,
		onClose: onCloseAddReply,
	} = useDisclosure()

	const {
		isOpen: isOpenUpdateReply,
		onOpen: onOpenUpdateReply,
		onClose: onCloseUpdateReply,
	} = useDisclosure()

	//query ---------------------------------------------------------------------
	//Get all replies of this discussion
	const { data: dataAllReplies, mutate: refetchDataAllReplies } = allRepliesByDiscussionQuery(
		isAuthenticated,
		discussionIdProp || (discussionIdRouter as string)
	)

	//Get detail discussion
	const { data: dataDetailDiscussion } = detailProjectDiscussionRoomQuery(
		isAuthenticated,
		Number(discussionIdProp || discussionIdRouter)
	)

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

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && (discussionIdProp || discussionIdRouter)) {
			socket.emit('joinRoomProjectDiscussion', discussionIdProp || discussionIdRouter)

			socket.on('getNewProjectDiscussionReply', () => {
				refetchDataAllReplies()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && (discussionIdProp || discussionIdRouter)) {
				socket.emit('leaveRoomProjectDiscussion', discussionIdProp || discussionIdRouter)
			}
		}

		return leaveRoom
	}, [socket, discussionIdProp, discussionIdRouter])

	return (
		<>
			<Box pos="relative" p={6} h="auto" as={'form'}>
				<VStack pos="relative" align={'start'} spacing={4}>
					<HStack
						w={'100%'}
						border={'1px'}
						borderColor={'gray.300'}
						p={4}
						borderRadius={5}
						justify={'space-between'}
					>
						<VStack align={'start'}>
							<Text fontWeight={'semibold'}>
								{dataDetailDiscussion?.projectDiscussionRoom?.title}
							</Text>
							<Text fontSize={12} color={'gray.400'}>
								posted on {dataDetailDiscussion?.projectDiscussionRoom?.createdAt}
							</Text>
						</VStack>

						<HStack>
							<Box w={3} h={3} borderRadius={'50%'} bgColor={'red'}></Box>
							<Text>
								{
									dataDetailDiscussion?.projectDiscussionRoom
										?.project_discussion_category.name
								}
							</Text>
						</HStack>
					</HStack>

					<Grid w={'full'} templateColumns="repeat(2, 1fr)" gap={7}>
						{dataAllReplies?.projectDiscussionReplies &&
							dataAllReplies.projectDiscussionReplies.map((reply) => (
								<GridItem w="100%" colSpan={[2]} key={reply.id}>
									<HStack
										w={'100%'}
										borderColor={'gray.300'}
										p={4}
										borderRadius={5}
										justify={'space-between'}
										align={'start'}
										bg={colorMode == 'light'? '#fafafa': '#1e2636'}
									>
										<HStack>
											<Avatar
												size="md"
												borderRadius={'10%'}
												name={reply.employee.name}
												src={reply.employee.avatar?.url}
											/>
											<VStack align={'start'}>
												<HStack>
													<Text fontWeight={'semibold'}>
														{reply.employee.name}
													</Text>
													<Text fontSize={12}>
														{moment(reply.createdAt).fromNow()}
													</Text>
												</HStack>
												<div
													dangerouslySetInnerHTML={{
														__html: reply.reply ? reply.reply : '',
													}}
												/>
											</VStack>
										</HStack>

										<HStack>
											{reply.employee.id === currentUser?.id && (
												<Text
													fontSize={14}
													color={'gray.400'}
													cursor={'pointer'}
													_hover={{
														color: 'green.400',
														fontWeight: 'semibold',
													}}
													onClick={() => {
														setReplyId(reply.id)
														onOpenUpdateReply()
													}}
												>
													Edit
												</Text>
											)}
											<Text
												fontSize={14}
												color={'gray.400'}
												cursor={'pointer'}
												_hover={{
													color: 'green.400',
													fontWeight: 'semibold',
												}}
												onClick={onOpenAddReply}
											>
												Reply
											</Text>
										</HStack>
									</HStack>
								</GridItem>
							))}
					</Grid>
				</VStack>
			</Box>

			{/* Modal add new reply */}
			<Modal
				size="3xl"
				isOpen={isOpenAddReply}
				onOpen={onOpenAddReply}
				onClose={onCloseAddReply}
				title="Add Reply"
			>
				<AddReply
					onCloseModal={onCloseAddReply}
					discussionId={discussionIdProp || (discussionIdRouter as string)}
					projectId={projectId as string}
				/>
			</Modal>

			{/* Modal edit reply */}
			<Modal
				size="3xl"
				isOpen={isOpenUpdateReply}
				onOpen={onOpenUpdateReply}
				onClose={onCloseUpdateReply}
				title="Edit Reply"
			>
				<UpdateReply
					onCloseModal={onCloseUpdateReply}
					discussionId={discussionIdProp || (discussionIdRouter as string)}
					replyId={replyId}
				/>
			</Modal>
		</>
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
