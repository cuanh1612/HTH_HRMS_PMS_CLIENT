import { Box, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { allRepliesByDiscussionQuery } from 'queries/projectDiscussionReply'
import { detailProjectDiscussionRoomQuery } from 'queries/projectDiscussionRoom'
import { useContext, useEffect } from 'react'
import { projectMutaionResponse } from 'type/mutationResponses'

export interface IDetailDiscussionProps {
	onCloseDrawer?: () => void
	discussionIdProp?: number
}

export default function DetailDiscussion({
	discussionIdProp = 3,
}: IDetailDiscussionProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { discussionId: discussionIdRouter } = router.query

	//State ---------------------------------------------------------------------

	//query ---------------------------------------------------------------------
	//Get all replies of this discussion
	const { data: dataAllReplies } = allRepliesByDiscussionQuery(
		isAuthenticated,
		discussionIdProp || (discussionIdRouter as string)
	)

	//Get detail discussion
	const { data: dataDetailDiscusison } = detailProjectDiscussionRoomQuery(
		isAuthenticated,
		Number(discussionIdProp || discussionIdRouter)
	)

	//mutation ------------------------------------------------------------------

	//Function ------------------------------------------------------------------

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
							{dataDetailDiscusison?.projectDiscussionRoom?.title}
						</Text>
						<Text fontSize={12} color={'gray.400'}>
							posted on {dataDetailDiscusison?.projectDiscussionRoom?.createdAt}
						</Text>
					</VStack>

					<HStack>
						<Box w={3} h={3} borderRadius={'50%'} bgColor={'red'}></Box>
						<Text>
							{
								dataDetailDiscusison?.projectDiscussionRoom
									?.project_discussion_category.name
							}
						</Text>
					</HStack>
				</HStack>

				<Grid w={'full'} templateColumns="repeat(2, 1fr)" gap={7}>
					{dataAllReplies?.projectDiscussionReplies &&
						dataAllReplies.projectDiscussionReplies.map((reply) => (
							<GridItem w="100%" colSpan={[2]} key={reply.id}>
                                huy
                            </GridItem>
						))}
				</Grid>
			</VStack>

			{/* {statusCreHolidays === 'running' && <Loading />} */}
		</Box>
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
