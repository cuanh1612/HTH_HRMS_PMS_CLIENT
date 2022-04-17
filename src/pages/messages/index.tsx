import { Box, Button, Grid, GridItem, HStack, Input, Text, useDisclosure } from '@chakra-ui/react'
import Modal from 'components/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allConversationsByUserQuery } from 'queries/conversation'
import { useContext, useEffect } from 'react'
import AddConversations from './add-conversations'

export interface IMessagesProps {}

export default function Messages(props: IMessagesProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//Setup modal -------------------------------------------------------
	const {
		isOpen: isOpenCreConversation,
		onOpen: onOpenCreConversation,
		onClose: onCloseCreConversation,
	} = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataConversations } = allConversationsByUserQuery(isAuthenticated, currentUser?.id)
	console.log(dataConversations);
	

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
		<Box pos="relative" height={'100%'} p={6}>
			<Grid templateColumns="repeat(6, 1fr)" gap={0} height={'100%'}>
				<GridItem w="100%" colSpan={1} border={'1px'} borderColor={'gray.200'}>
					huy
				</GridItem>

				<GridItem
					w="100%"
					height={'100%'}
					colSpan={5}
					border={'1px'}
					borderColor={'gray.200'}
					position={'relative'}
				>
					<Box w={'full'} borderBottom={'1px'} borderColor={'gray.200'} p={4}>
						<HStack justify={'space-between'}>
							<Text fontWeight={'semibold'}>Diana Ortiz</Text>
							<Button onClick={onOpenCreConversation}>New Conversation</Button>
						</HStack>
					</Box>

					<Box w={'full'} p={4} height={'calc(100% - 146px)'}>
						huy
					</Box>

					<Box w={'full'} p={4} borderTop={'1px'} borderColor={'gray.200'}>
						<HStack>
							<Input />
							<Button>send</Button>
						</HStack>
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
