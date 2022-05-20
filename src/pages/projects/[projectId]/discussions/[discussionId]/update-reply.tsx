import { Box, Button, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { updateProjectDiscussionReplyMutation } from 'mutations/projectDiscussionReply'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
	allRepliesByDiscussionQuery,
	detailDiscussionReplyQuery,
} from 'queries/projectDiscussionReply'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { projectMutaionResponse } from 'type/mutationResponses'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IUpdateReplyProps {
	discussionId: string | number
	replyId?: string | number
	onCloseModal?: () => void
}

export default function UpdateReply({ onCloseModal, replyId, discussionId }: IUpdateReplyProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const router = useRouter()

	//State --------------------------------------------------------------
	const [reply, setReply] = useState<string>('')

	//Query --------------------------------------------------------------
	//Get all replies of this discussion
	const { mutate: refetchAllReplies } = allRepliesByDiscussionQuery(
		isAuthenticated,
		discussionId as string
	)

	const { data: detailDiscussionRepaly } = detailDiscussionReplyQuery(isAuthenticated, replyId)

	//Mutation -----------------------------------------------------------
	const [
		mutateUpProjectDiscussionReplyType,
		{ status: statusUpProjectDiscussionReplyType, data: dataUpProjectDiscussionReplyType },
	] = updateProjectDiscussionReplyMutation(setToast)

	//Function -----------------------------------------------------------
	const onSubmitReply = () => {
		if (!replyId || !reply) {
			setToast({
				msg: 'Please enter full field',
				type: 'warning',
			})
		} else {
			mutateUpProjectDiscussionReplyType({
				reply,
				discussionReplyId: replyId,
			})
		}
	}

	const onChangeReply = (value: string) => {
		setReply(value)
	}

	//Useeffect ----------------------------------------------------------
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

	//Notice when create success
	useEffect(() => {
		switch (statusUpProjectDiscussionReplyType) {
			case 'success':
				if (dataUpProjectDiscussionReplyType) {
					//Notice
					setToast({
						type: 'success',
						msg: dataUpProjectDiscussionReplyType?.message,
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
	}, [statusUpProjectDiscussionReplyType])

	//Set again detai reply when have data detail reply
	useEffect(() => {
		if (detailDiscussionRepaly?.projectDiscussionReply) {
			setReply(detailDiscussionRepaly.projectDiscussionReply.reply)
		}
	}, [detailDiscussionRepaly])

	return (
		<Box>
			<VStack align={'start'}>
				<Box w="full" paddingInline={6}>
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'}>
								<Text fontWeight={'normal'} color={'gray.400'}>
									Reply <span style={{ color: 'red' }}>*</span>
								</Text>
								<ReactQuill
									placeholder="Enter you text"
									modules={{
										toolbar: [
											['bold', 'italic', 'underline', 'strike'], // toggled buttons
											['blockquote', 'code-block'],

											[{ header: 1 }, { header: 2 }], // custom button values
											[{ list: 'ordered' }, { list: 'bullet' }],
											[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
											[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
											[{ direction: 'rtl' }], // text direction

											[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
											[{ header: [1, 2, 3, 4, 5, 6, false] }],

											[{ color: [] }, { background: [] }], // dropdown with defaults from theme
											[{ font: [] }],
											[{ align: [] }],

											['clean'], // remove formatting button
										],
									}}
									value={reply}
									onChange={onChangeReply}
								/>
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
					{statusUpProjectDiscussionReplyType === 'running' && <Loading />}
				</Box>
			</VStack>
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
