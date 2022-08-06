import { Box, Button, HStack, useDisclosure, VStack } from '@chakra-ui/react'
import { Head } from 'components/common'
import { Drawer } from 'components/Drawer'
import { ProjectLayout } from 'components/layouts'
import Modal from 'components/modal/Modal'
import ProjectDiscussionItem from 'components/projectDiscussion/projectDiscussionItem'
import { AuthContext } from 'contexts/AuthContext'
import { deleteProjectDiscussionRoomMutation } from 'mutations'
import { GetServerSideProps } from 'next'

import { useRouter } from 'next/router'
import { allProjectDiscussionRoomsQuery, detailProjectQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlinePlusCircle } from 'react-icons/ai'
import ProjectDiscussionCategory from 'src/pages/project-discussion-categories'
import { NextLayout } from 'type/element/layout'
import {
	ProjectDiscussionRoomMutationResponse,
	projectMutationResponse,
} from 'type/mutationResponses'
import AddDiscussion from '../add-discussion'
import DetailDiscussion from './[discussionId]'

export interface IDiscussionsProps {
	allDiscussionRooms: ProjectDiscussionRoomMutationResponse
}

const Discussions: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, socket, currentUser } =
		useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//state ----------------------------------------------------------------------
	const [discussionId, setDiscussionId] = useState<number>()

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenAddDiscussion,
		onOpen: onOpenAddDiscussion,
		onClose: onCloseAddDiscussion,
	} = useDisclosure()

	const {
		isOpen: isOpenAddDiscussionCategory,
		onOpen: onOpenAddDiscussionCategory,
		onClose: onCloseAddDiscussionCategory,
	} = useDisclosure()

	const {
		isOpen: isOpenDetailDiscussion,
		onOpen: onOpenDetailDiscussion,
		onClose: onCloseDetailDiscussion,
	} = useDisclosure()

	//Query ---------------------------------------------------------------------
	const { data: dataAllProjectDiscussionRooms, mutate: refetchAllDiscussionRooms } =
		allProjectDiscussionRoomsQuery(isAuthenticated, Number(projectId))

	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, Number(projectId))

	//Mutation ------------------------------------------------------------------
	const [
		mutateDeProjectDiscussionRoomType,
		{ status: statusDeProjectDiscussionRoomType, data: dataDeProjectDiscussionRoomType },
	] = deleteProjectDiscussionRoomMutation(setToast)

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
		if (socket && projectId) {
			socket.emit('joinRoomProject', projectId)

			socket.on('getNewProjectDiscussion', () => {
				refetchAllDiscussionRooms()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && discussionId) {
				socket.emit('leaveRoomProject', projectId)
			}
		}

		return leaveRoom
	}, [socket, projectId])

	//Notice when create success
	useEffect(() => {
		switch (statusDeProjectDiscussionRoomType) {
			case 'success':
				if (dataDeProjectDiscussionRoomType) {
					//Notice
					setToast({
						type: 'success',
						msg: dataDeProjectDiscussionRoomType?.message,
					})

					if (socket && projectId) {
						socket.emit('newProjectDiscussion', projectId)
					}

					//Refetch data all project discussion rooms
					refetchAllDiscussionRooms()
				}
				break

			default:
				break
		}
	}, [statusDeProjectDiscussionRoomType])

	//handle select discussion to open drawer
	const onChangeSelectDiscussion = (discussionId: number) => {
		setDiscussionId(discussionId)
		onOpenDetailDiscussion()
	}

	return (
		<Box pb={8}>
			<Head title={dataDetailProject?.project?.name}/>
			<Box p={10} bgColor={'#f2f4f7'}>
				<VStack
					align={'start'}
					w="full"
					bgColor={'white'}
					p={5}
					borderRadius={5}
					spacing={5}
				>
					<HStack spacing={5}>
						<Button
							leftIcon={<AiOutlinePlusCircle />}
							onClick={onOpenAddDiscussion}
							colorScheme="blue"
						>
							New Discussion
						</Button>
						{((currentUser && currentUser.role === 'Admin') ||
							(currentUser &&
								dataDetailProject?.project?.project_Admin &&
								currentUser.email ===
									dataDetailProject.project.project_Admin.email)) && (
							<Button
								leftIcon={<AiOutlineEdit />}
								onClick={onOpenAddDiscussionCategory}
							>
								New Category
							</Button>
						)}
					</HStack>

					<VStack w={'100%'}>
						{dataAllProjectDiscussionRooms?.projectDiscussionRooms &&
							dataAllProjectDiscussionRooms.projectDiscussionRooms.map(
								(discussionRoom) => (
									<>
										<ProjectDiscussionItem
											onDelete={mutateDeProjectDiscussionRoomType}
											key={discussionRoom.id}
											discussionRoom={discussionRoom}
											onClick={onChangeSelectDiscussion}
											isOnChange={
												(currentUser && currentUser.role === 'Admin') ||
												(currentUser &&
													dataDetailProject?.project?.project_Admin &&
													currentUser.email ===
														dataDetailProject.project.project_Admin
															.email) ||
												discussionRoom.assigner.id === currentUser?.id
													? true
													: false
											}
										/>
									</>
								)
							)}
					</VStack>
				</VStack>
			</Box>

			{/* Modal add new discussion */}
			<Modal
				size="3xl"
				isOpen={isOpenAddDiscussion}
				onOpen={onOpenAddDiscussion}
				onClose={onCloseAddDiscussion}
				title="Add New Discussion"
			>
				<AddDiscussion onCloseModal={onCloseAddDiscussion} />
			</Modal>

			{/* Modal add new discussion category */}
			<Modal
				size="3xl"
				isOpen={isOpenAddDiscussionCategory}
				onOpen={onOpenAddDiscussionCategory}
				onClose={onCloseAddDiscussionCategory}
				title="Discussion Category"
			>
				<ProjectDiscussionCategory />
			</Modal>

			{/* drawer to show detail discussion */}
			<Drawer
				size="xl"
				title="Discussion"
				onClose={onCloseDetailDiscussion}
				isOpen={isOpenDetailDiscussion}
			>
				<DetailDiscussion
					onCloseDrawer={onCloseDetailDiscussion}
					discussionIdProp={discussionId}
				/>
			</Drawer>
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

Discussions.getLayout = ProjectLayout
export default Discussions
