import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { MdOutlineRemoveCircleOutline } from 'react-icons/md'
import { conversationType, employeeType } from 'type/basicTypes'

export interface IReceiverProps {
	employee: employeeType
	conversation: conversationType
	onChangeReceiver: (conversation: conversationType, employee: employeeType) => void
	isActive: boolean
	onDeleteConversation: (conversationId: number) => void
}

export const Receiver = ({
	employee,
	onChangeReceiver,
	isActive,
	conversation,
	onDeleteConversation,
}: IReceiverProps) => {
	return (
		<Box
			onClick={() => onChangeReceiver(conversation, employee)}
			borderBottom={'1px'}
			p={4}
			borderColor={'gray.200'}
			cursor={'pointer'}
			bgColor={isActive ? '#e8eef3' : undefined}
			_hover={{
				bgColor: '#e8eef3',
			}}
		>
			<HStack justify={'space-between'} align={'start'}>
				<HStack>
					<Avatar size={'sm'} name={employee.name} src={employee.avatar?.url} />
					<VStack align={'start'}>
						<Text>{employee.name}</Text>
						<Text fontSize={12} color={'gray.400'}>
							{employee.email}
						</Text>
					</VStack>
				</HStack>
				<Box>
					<MdOutlineRemoveCircleOutline
						color="red"
						onClick={() => onDeleteConversation(conversation.id)}
					/>
				</Box>
			</HStack>
		</Box>
	)
}
