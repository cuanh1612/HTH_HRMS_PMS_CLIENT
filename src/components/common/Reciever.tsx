import { Avatar, Box, HStack, Text } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import * as React from 'react'
import { conversationType, employeeType } from 'type/basicTypes'

export interface IReceiverProps {
	employee: employeeType
	conversation: conversationType
	onChangeReceiver: (conversation: conversationType, employee: employeeType) => void
	isActive: boolean
}

export const Receiver = ({
	employee,
	onChangeReceiver,
	isActive,
	conversation,
}: IReceiverProps) => {
	const { currentUser } = React.useContext(AuthContext)
	return (
		<HStack
			justify={'space-between'}
			align={'start'}
			borderRadius={['10px', null, null, null, '20px 0px 0px 20px']}
			onClick={() => onChangeReceiver(conversation, employee)}
			p={4}
			cursor={'pointer'}
			transition={'0.2s'}
			bgColor={isActive ? 'hu-Green.lightA' : undefined}
			color={isActive ? 'black' : undefined}
			_hover={{
				bgColor: '#e8eef3',
				color: 'black',
			}}
			pr={'20px'}
		>
			<HStack overflow={'hidden'} spacing={3}>
				<Avatar size={'sm'} name={employee.name} src={employee.avatar?.url} />
				<Box>
					<Text fontSize={'16px'} fontWeight={'semibold'}>
						{employee.name}
					</Text>
					{conversation.latest_messager.length > 0 && (
						<Text isTruncated color={isActive ? 'gray.500': 'gray.400'} fontSize={14}>
							{currentUser?.id == conversation.latest_messager[0].userId && 'You: '}
							{conversation.latest_messager[0].reply}
						</Text>
					)}
				</Box>
			</HStack>
			{conversation.messages_not_read != 0 && (
				<Box
					minW={'20px'}
					w={'20px'}
					h={'20px'}
					borderRadius="full"
					pos={'relative'}
					border={'2px solid'}
					borderColor={'hu-Green.normal'}
					color={'hu-Green.normal'}
				>
					<Text fontSize={'12px'} pos={'absolute'} top={'-1px'} left={'5px'}>
						{conversation.messages_not_read}
					</Text>
				</Box>
			)}
		</HStack>
	)
}
