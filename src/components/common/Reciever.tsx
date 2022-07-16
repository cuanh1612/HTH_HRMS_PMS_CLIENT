import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
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
		<HStack
			justify={'space-between'}
			align={'start'}
			borderTopLeftRadius={'20px'}
			borderBottomLeftRadius={'20px'}
			onClick={() => onChangeReceiver(conversation, employee)}
			p={4}
			cursor={'pointer'}
			transition={'0.2s'}
	
			bgColor={isActive ? 'hu-Green.lightA' : undefined}
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
					<Text isTruncated w={'50%'} color={'gray.400'} fontSize={14}>
						nguyen quang hoang hdsf s df ff f nguyen quang hoang hdsf s df ff f
					</Text>
				</Box>
			</HStack>
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
				<Text
					fontSize={'12px'}
					pos={'absolute'}
					top={'-1px'}
					left={'5px'}
				>
					5
				</Text>
			</Box>
			{/* <Box>
				<MdOutlineRemoveCircleOutline
					color="red"
					onClick={() => onDeleteConversation(conversation.id)}
				/>
			</Box> */}
		</HStack>
	)
}
