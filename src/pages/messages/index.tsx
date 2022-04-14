import { Box, Button, Grid, GridItem, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Input } from 'components/form/Input'
import Message from 'components/Message'
import Modal from 'components/Modal'
import Receiver from 'components/Reciever'
import { AuthContext } from 'contexts/AuthContext'
import { createConversationReplyMutation } from 'mutations/conversationReply'
import { useRouter } from 'next/router'
import { allConversationsByUserQuery } from 'queries/conversation'
import { allConversationRepliesByConversationQuery } from 'queries/coversationReply'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { conversationType, employeeType } from 'type/basicTypes'
import { createConversationReplyForm } from 'type/form/basicFormType'
import AddConversations from './add-conversations'
import { AiOutlineSend } from 'react-icons/ai'
import Loading from 'components/Loading'

export interface IMessagesProps {}

export default function Messages(props: IMessagesProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()

	//Setup modal -------------------------------------------------------
	const {
		isOpen: isOpenCreConversation,
		onOpen: onOpenCreConversation,
		onClose: onCloseCreConversation,
	} = useDisclosure()

	//State -------------------------------------------------------------
	const [currentReceiver, setCurrentReceiver] = useState<{
		converstion: number
		email: string
		name: string
	} | null>(null)

	//Query -------------------------------------------------------------
	const { data: dataConversations } = allConversationsByUserQuery(
		isAuthenticated,
		currentUser?.id
	)

	//Get all replies of current conversation
	const { data: dataConversationReplies, mutate: refetchReplies } =
		allConversationRepliesByConversationQuery(isAuthenticated, currentReceiver?.converstion)

	//mutation ----------------------------------------------------------
	const [
		mutateCreConversationReply,
		{ status: statusCreConversationReply, data: dataCreConversationReply },
	] = createConversationReplyMutation(setToast)

	// setForm and submit form create repliy -----------------------------
	const formSetting = useForm<createConversationReplyForm>({
		defaultValues: {
			reply: '',
		},
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: createConversationReplyForm) => {
		if (!currentUser?.id) {
			setToast({
				type: 'warning',
				msg: 'Please login first',
			})
		} else if (!currentReceiver?.converstion) {
			setToast({
				type: 'warning',
				msg: 'Please select conversation',
			})
		} else if (!values.reply) {
			setToast({
				type: 'warning',
				msg: 'Please enter message',
			})
		} else {
			values.user = currentUser.id
			values.conversation = currentReceiver.converstion

			//Create conversation rely
			mutateCreConversationReply(values)
		}
	}

	//Function ----------------------------------------------------------
	//Handle change current receiver
	const onChangeReceiver = (conversation: conversationType, employee: employeeType) => {
		setCurrentReceiver({
			converstion: conversation.id,
			email: employee.email,
			name: employee.name,
		})
	}

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

	//Note when request success
	useEffect(() => {
		if (statusCreConversationReply === 'success') {
			//Reset data form
			formSetting.reset({
				reply: '',
			})

			//emit socket for receiver
			if (socket) {
				socket.emit('newReply', {
					email: currentReceiver?.email,
					conversation: currentReceiver?.converstion,
				})
			}

			//Refetch replies of current conversation
			refetchReplies()
		}
	}, [statusCreConversationReply])

	useEffect(() => {
		//Join room
		if (socket) {
			socket.on('getNewReply', (conversation: number) => {
				//Refetch messages of conversation
				mutate(`conversation-replies/conversation/${conversation}`)
			})
		}
	}, [socket])

	//Scroll to bottom message
	useEffect(() => {
		if (document.getElementById('messages')) {
			document.getElementById('messages')?.scrollTo({
				top: document.getElementById('messages')?.scrollHeight,
			})
		}
	})

	return (
		<Box pos="relative" height={'100%'} p={6}>
			<Grid templateColumns="repeat(6, 1fr)" gap={0} height={'100%'}>
				<GridItem
					w="100%"
					colSpan={[0, 2, 2, 2, 1]}
					border={'1px'}
					borderColor={'gray.200'}
				>
					{dataConversations?.conversations &&
						dataConversations.conversations.map((conversation) => (
							<Box key={conversation.id}>
								{conversation.employees.map((employee) => {
									if (employee.email !== currentUser?.email) {
										return (
											<Receiver
												key={employee.email}
												employee={employee}
												conversation={conversation}
												onChangeReceiver={onChangeReceiver}
												isActive={currentReceiver?.email === employee.email}
											/>
										)
									} else {
										return
									}
								})}
							</Box>
						))}
				</GridItem>

				<GridItem
					w="100%"
					height={'100%'}
					colSpan={[6, 4, 4, 4, 5]}
					border={'1px'}
					borderColor={'gray.200'}
					position={'relative'}
				>
					<Box w={'full'} borderBottom={'1px'} borderColor={'gray.200'} p={4}>
						<HStack justify={'space-between'}>
							<Text fontWeight={'semibold'}>{currentReceiver?.name}</Text>
							<Button onClick={onOpenCreConversation}>New Conversation</Button>
						</HStack>
					</Box>

					<VStack
						align={'start'}
						spacing={6}
						w={'full'}
						p={4}
						height={'calc(100% - 146px)'}
						maxHeight={'80vh'}
						minHeight={'100px'}
						overflow={'auto'}
						id={'messages'}
					>
						{dataConversationReplies?.replies &&
							dataConversationReplies.replies.map((conversationReply) => {
								return (
									<Message
										key={conversationReply.id}
										placement={
											conversationReply.user.email === currentUser?.email
												? 'right'
												: 'left'
										}
										name={conversationReply.user.name}
										avatarUrl={conversationReply.user.avatar?.url}
										text={conversationReply.reply}
										createAt={new Date()}
									/>
								)
							})}
					</VStack>

					<Box
						w={'full'}
						p={4}
						borderTop={'1px'}
						borderColor={'gray.200'}
						as={'form'}
						onSubmit={handleSubmit(onSubmit)}
						position={'relative'}
					>
						<HStack>
							<Input
								form={formSetting}
								name={'reply'}
								placeholder={'Enter reply'}
								type={'text'}
							/>
							<Button
								type="submit"
								rightIcon={<AiOutlineSend />}
								disabled={currentReceiver ? false : true}
							>
								send
							</Button>
						</HStack>

						{statusCreConversationReply === 'running' && <Loading />}
					</Box>
				</GridItem>
			</Grid>

			{/* Modal department and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenCreConversation}
				onOpen={onOpenCreConversation}
				onClose={onCloseCreConversation}
				title="Add Conversation"
			>
				<AddConversations />
			</Modal>
		</Box>
	)
}
