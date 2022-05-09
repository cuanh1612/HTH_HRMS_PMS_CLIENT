import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
import moment from 'moment'

export interface IMessageProps {
	name: string
	avatarUrl: string | undefined
	createAt: Date
	text: string
	placement: 'left' | 'right'
}

export default function Message({ name, avatarUrl, text, placement, createAt }: IMessageProps) {
	return (
		<Box
			w={'full'}
			paddingRight={placement === 'left' ? 16 : undefined}
			paddingLeft={placement === 'right' ? 16 : undefined}
		>
			<HStack align={'start'} justify={placement === 'right' ? 'end' : undefined} spacing={4}>
				{placement === 'left' && <Avatar name={name} src={avatarUrl} />}
				<VStack align={placement === 'left' ? 'start' : 'end'}>
					<Text fontWeight={'semibold'}>{name}</Text>
					<Text fontSize={12} color={'gray.400'}>
						{moment(createAt).fromNow()}
					</Text>
					<Box
						p={2}
						borderRadius={
							placement === 'left' ? '0px 10px 10px 10px' : '10px 0px 10px 10px'
						}
						bgColor={'#e8eef3'}
						maxW={'800px'}
					>
						{text}
					</Box>
				</VStack>

				{placement === 'right' && <Avatar name={name} src={avatarUrl} />}
			</HStack>
		</Box>
	)
}
