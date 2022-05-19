import { Avatar, Box, Button, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import Modal from 'components/modal/Modal'
import ProjectDiscussionItem from 'components/projectDiscussion/projectDiscussionItem'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allProjectDiscussionRoomsQuery } from 'queries/projectDiscussionRoom'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineComment, AiOutlineEdit, AiOutlinePlusCircle } from 'react-icons/ai'
import ProjectDiscussionCategory from 'src/pages/project-discussion-categories'
import {
	ProjectDisucssionRoomMutaionResponse,
	projectMutaionResponse,
} from 'type/mutationResponses'
import AddDiscussion from '../add-discussion'
import DetailDiscussion from './[discussionId]'

export interface IDiscussionsProps {
	allDiscussionRooms: ProjectDisucssionRoomMutaionResponse
}

export default function Discussions({}: IDiscussionsProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
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
	const { data: dataAllProjectDisucssionRooms } =
		allProjectDiscussionRoomsQuery(isAuthenticated, Number(projectId))

	console.log(dataAllProjectDisucssionRooms)

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

	//handle select discussion to open drawer
	const onChangeSelectDiscussion = (discussionId: number) => {
		setDiscussionId(discussionId)
		onOpenDetailDiscussion()
	}

	return (
		<>
			<Box p={10} bgColor={'#f2f4f7'} minHeight={'100vh'}>
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
						<Button leftIcon={<AiOutlineEdit />} onClick={onOpenAddDiscussionCategory}>
							New Category
						</Button>
					</HStack>

					<VStack w={'100%'}>
						{dataAllProjectDisucssionRooms?.projectDiscussionRooms &&
							dataAllProjectDisucssionRooms.projectDiscussionRooms.map(
								(discussionRoom) => (
									<>
										<ProjectDiscussionItem key={discussionRoom.id} discussionRoom={discussionRoom} onClick={onChangeSelectDiscussion}/>
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
				<AddDiscussion />
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
			<Drawer size="xl" title="Discussion" onClose={onCloseDetailDiscussion} isOpen={isOpenDetailDiscussion}>
				<DetailDiscussion onCloseDrawer={onCloseDetailDiscussion} discussionIdProp={discussionId}/>
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

	//Get all discussion room by project
	const allDiscussions: ProjectDisucssionRoomMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/project-discussion-rooms/project/${context.query.projectId}`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!allDiscussions.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			allDiscussionRooms: allDiscussions,
		},
	}
}
