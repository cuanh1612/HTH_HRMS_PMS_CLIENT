import {
	Box,
	Button,
	HStack,
	Text,
	useDisclosure,
	VStack,
	Input as InputChakra,
	InputGroup,
	InputRightElement,
	useColorMode,
	IconButton,
} from '@chakra-ui/react'
import { Input } from 'components/form'
import Modal from 'components/modal/Modal'
import { Receiver, Loading, Message, MenuIcons } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createConversationReplyMutation, deleteConversationMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allConversationsByUserQuery, allConversationRepliesByConversationQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { conversationReplyType, conversationType, employeeType } from 'type/basicTypes'
import { createConversationReplyForm } from 'type/form/basicFormType'
import AddConversations from './add-conversations'
import { AiOutlineMenu, AiOutlineSearch, AiOutlineSend } from 'react-icons/ai'
import { Drawer } from 'components/Drawer'
import { NextLayout } from 'type/element/layout'
import { ClientLayout } from 'components/layouts'
import Head from 'next/head'

const Messages: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//Setup modal -------------------------------------------------------
	const {
		isOpen: isOpenCreConversation,
		onOpen: onOpenCreConversation,
		onClose: onCloseCreConversation,
	} = useDisclosure()

	//Setup drawer -------------------------------------------------------
	const {
		isOpen: isOpenManageMessages,
		onOpen: onOpenManageMessages,
		onClose: onCloseManageMessages,
	} = useDisclosure()

	//State -------------------------------------------------------------
	const [currentReceiver, setCurrentReceiver] = useState<{
		converstion: number
		email: string
		name: string
	}>()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [conversationId, setConversationId] = useState<number | null>(null)
	const [replies, setReplies] = useState<conversationReplyType[]>([])
	const [conversations, setConversations] = useState<conversationType[] | null>(null)
	const [search, setSearch] = useState<string>('')

	//Query -------------------------------------------------------------
	const { data: dataConversations, mutate: refetchConversations } = allConversationsByUserQuery(
		isAuthenticated,
		currentUser?.id
	)

	//Get all replies of current conversation
	const { data: dataConversationReplies, mutate: refetchReplies } =
		allConversationRepliesByConversationQuery(isAuthenticated, currentReceiver?.converstion)

	//mutation ----------------------------------------------------------
	const [
		mutateCreConversationReply,
		{ status: statusCreConversationReply, data: dataCreateReply },
	] = createConversationReplyMutation(setToast)

	const [
		mutateDeleteConversation,
		{ status: statusDeleteConversation, data: dataDeleteConversation },
	] = deleteConversationMutation(setToast)

	// setForm and submit form create reply -----------------------------
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

		setIsLoading(true)

		onCloseManageMessages()
	}

	//Handle delete conversation
	const onDeleteConversation = (conversationId: number | null) => {
		if (!currentUser?.id) {
			setToast({
				type: 'warning',
				msg: 'You must login first',
			})
		} else {
			mutateDeleteConversation({ conversationId, userId: currentUser.id })
		}
	}

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

	useEffect(() => {
		if (conversationId) {
			localStorage.setItem('conversationId', `${conversationId}`)
		} else {
			localStorage.setItem('conversationId', `${0}`)
		}
	}, [conversationId])

	useEffect(() => {
		if (dataConversations?.conversations) {
			setConversations(dataConversations.conversations)
		} else {
			setConversations(null)
		}
	}, [dataConversations])

	useEffect(() => {
		if (dataConversationReplies) {
			setReplies(dataConversationReplies.replies)
			setTimeout(() => {
				setIsLoading(false)
			}, 200)

			//refetch all list conversations to get update count conversation replies not already read
			refetchConversations()
		}
	}, [dataConversationReplies])

	//Note when request success
	useEffect(() => {
		if (statusCreConversationReply === 'success' && dataCreateReply?.reply) {
			//Reset data form
			formSetting.reset({
				reply: '',
			})

			//emit socket for receiver
			if (socket) {
				socket.emit('newReply', {
					email: currentReceiver?.email,
					conversation: currentReceiver?.converstion,
					newReplies: [...replies, dataCreateReply.reply],
				})
			}
			setReplies([...replies, dataCreateReply.reply])

			//Refetch replies of current conversation
			refetchReplies()
			refetchConversations()
		}
	}, [statusCreConversationReply])

	//Note when request delete success
	useEffect(() => {
		if (statusDeleteConversation === 'success') {
			//Notice success
			if (dataDeleteConversation) {
				setToast({
					msg: dataDeleteConversation?.message,
					type: statusDeleteConversation,
				})
			}

			//Set current receiver
			setCurrentReceiver(undefined)

			//Refetch all conversation by user
			refetchConversations()

			//Refetch replies of current conversation
			refetchReplies()
		}
	}, [statusDeleteConversation])

	useEffect(() => {
		//Join room
		if (socket) {
			socket.on(
				'getNewReply',
				(conversation: number, newReplies: conversationReplyType[]) => {
					if (Number(localStorage.getItem('conversationId')) == conversation) {
						setReplies(newReplies)
					}

					// //Refetch messages of conversation
					mutate(`conversation-replies/conversation/${conversation}`)
					//refetch all list conversations to get update count conversation replies not already read
					refetchConversations()
				}
			)
		}
	}, [socket])

	useEffect(() => {
		const searchTimeout = setTimeout(() => {
			if (search) {
				if (
					dataConversations?.conversations &&
					dataConversations.conversations.length > 0
				) {
					const data = dataConversations.conversations.filter((conversation) => {
						const employee = conversation.employees.find((e) => {
							if (e.id == currentUser?.id) return false
							return true
						})
						if (employee && employee.name.includes(search)) {
							return true
						}
						return false
					})
					setConversations(data)
				}
			} else {
				if (dataConversations?.conversations) {
					setConversations(dataConversations?.conversations)
				}
			}
		}, 200)
		return ()=> {
			clearTimeout(searchTimeout)
		}
	}, [search])

	//Scroll to bottom message
	useEffect(() => {
		if (document.getElementById('messages')) {
			document.getElementById('messages')?.scrollTo({
				top: document.getElementById('messages')?.scrollHeight,
			})
		}
	})

	return (
		<Box minH={'500px'} pos="relative" height={'calc( 100vh - 130px )'}>
			<Head>
				<title>Huprom - Messages</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<HStack spacing={8} height={'100%'}>
				<VStack
					w="350px"
					minW={'350px'}
					borderRadius={'20px'}
					overflow={'auto'}
					h={'100%'}
					bg={colorMode == 'dark' ? '#1e2636' : '#f4f6f8'}
					spacing={5}
					display={['none', null, null, null, 'flex']}
				>
					<HStack
						p={'20px'}
						w={'full'}
						borderBottom={'1px solid'}
						borderColor={'#e5e8ee'}
						spacing={4}
					>
						<InputGroup>
							<InputChakra
								value={search}
								onChange={(e) => {
									setSearch(e.target.value)
								}}
								bg={colorMode == 'dark' ? '#3a4453' : '#e5e8ee'}
								color={colorMode == 'dark' ? 'white' : undefined}
								placeholder="Search"
							/>
							<InputRightElement
								color={colorMode == 'dark' ? 'gray' : undefined}
								children={<AiOutlineSearch color="green.500" />}
							/>
						</InputGroup>

						<Button
							bg={'#e5e8ee'}
							color={'black'}
							_hover={{
								bg: 'hu-Green.normal',
								color: 'white',
							}}
							_active={{
								bg: 'hu-Green.lightA',
								color: 'white',
							}}
							onClick={onOpenCreConversation}
						>
							Add
						</Button>
					</HStack>

					<VStack overflow={'auto'} maxH={'calc( 100% - 130px )'} w={'full'} spacing={3}>
						{conversations &&
							conversations.map((conversation, key) => (
								<Box
									h={'77px'}
									minH={'77px'}
									w={'full'}
									overflow={'hidden'}
									pl={'20px'}
									key={key}
									onClick={() => {
										setConversationId(conversation.id)
									}}
								>
									{conversation.employees.map((employee, key) => {
										if (employee.email !== currentUser?.email) {
											return (
												<Receiver
													key={key}
													employee={employee}
													conversation={conversation}
													onChangeReceiver={onChangeReceiver}
													isActive={
														currentReceiver?.email === employee.email
													}
												/>
											)
										} else {
											return
										}
									})}
								</Box>
							))}
					</VStack>
				</VStack>

				<VStack w="100%" height={'100%'} position={'relative'}>
					<Box h={'83px'} w={'full'} borderBottom={'1px'} borderColor={'#e5e8ee'} p={4}>
						<HStack justify={'space-between'}>
							<Text fontSize={'24px'} fontWeight={'semibold'}>
								{currentReceiver?.name}
							</Text>
							<HStack spacing={5}>
								<Button
									disabled={currentReceiver ? false : true}
									onClick={() => {
										onDeleteConversation(conversationId)
									}}
									colorScheme={'red'}
								>
									remove
								</Button>
								<IconButton
									display={['flex', null, null, null, 'none']}
									aria-label={'menu'}
									onClick={onOpenManageMessages}
									icon={<AiOutlineMenu />}
								/>
							</HStack>
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
						{replies &&
							replies.map((conversationReply, key) => {
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
										createAt={conversationReply.createdAt}
									/>
								)
							})}
					</VStack>
					{isLoading && <Loading />}

					<HStack
						spacing={3}
						w={'full'}
						pt={4}
						paddingInline={4}
						borderTop={'1px'}
						borderColor={'#e5e8ee'}
						position={'relative'}
					>
						<HStack
							w={'full'}
							spacing={3}
							as={'form'}
							onSubmit={handleSubmit(onSubmit)}
						>
							<Input
								form={formSetting}
								name={'reply'}
								placeholder={'Enter reply'}
								type={'text'}
								autoComplete={'off'}
							/>
							<Button
								type="submit"
								rightIcon={<AiOutlineSend />}
								disabled={currentReceiver ? false : true}
							>
								send
							</Button>
						</HStack>
						<MenuIcons
							isDisable={currentReceiver ? false : true}
							handle={(icon: string) => {
								formSetting.reset({
									reply: `${formSetting.getValues('reply')} ${icon}`,
								})
							}}
						/>

						{statusCreConversationReply === 'running' && <Loading />}
					</HStack>
				</VStack>
			</HStack>

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

			<Drawer
				size="sm"
				title="Conversations"
				onClose={onCloseManageMessages}
				isOpen={isOpenManageMessages}
			>
				<HStack p={'20px'} w={'full'} mt={2} spacing={4}>
					<InputGroup>
						<InputChakra
							value={search}
							onChange={(e) => {
								setSearch(e.target.value)
							}}
							bg={colorMode == 'dark' ? '#3a4453' : '#e5e8ee'}
							color={colorMode == 'dark' ? 'white' : undefined}
							placeholder="Search"
						/>
						<InputRightElement
							color={colorMode == 'dark' ? 'gray' : undefined}
							children={<AiOutlineSearch color="green.500" />}
						/>
					</InputGroup>

					<Button
						bg={'#e5e8ee'}
						color={'black'}
						_hover={{
							bg: 'hu-Green.normal',
							color: 'white',
						}}
						_active={{
							bg: 'hu-Green.lightA',
							color: 'white',
						}}
						onClick={onOpenCreConversation}
					>
						Add
					</Button>
				</HStack>
				<VStack
					overflow={'auto'}
					h={'calc( 100vh - 90px )'}
					spacing={5}
					paddingInline={6}
					w={'full'}
					mt={2}
				>
					{conversations &&
						conversations.map((conversation, key) => (
							<Box w={'full'} key={key}>
								{conversation.employees.map((employee, key) => {
									if (employee.email !== currentUser?.email) {
										return (
											<Receiver
												key={key}
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
				</VStack>
			</Drawer>
		</Box>
	)
}

Messages.getLayout = ClientLayout

export default Messages
