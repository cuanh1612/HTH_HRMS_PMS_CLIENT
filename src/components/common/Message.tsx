import { Avatar, Box, HStack, Text, useColorMode, VStack } from '@chakra-ui/react'
import * as React from 'react'
import moment from 'moment'

export interface IMessageProps {
	name: string
	avatarUrl: string | undefined
	createAt: Date
	text: string
	placement: 'left' | 'right'
}

export const Message = ({ name, avatarUrl, text, placement, createAt }: IMessageProps) => {
	const {colorMode} = useColorMode()
	return (
		<Box
			w={'full'}
			paddingRight={placement === 'left' ? 16 : undefined}
			paddingLeft={placement === 'right' ? 16 : undefined}
		>
			<HStack align={'start'} justify={placement === 'right' ? 'end' : undefined} spacing={4}>
				{placement === 'left' && <Avatar name={name} src={avatarUrl} />}
				<VStack spacing={1} align={placement === 'left' ? 'start' : 'end'}>
					<Text fontWeight='semibold'>{name}</Text>
					<Box>
						<Text mb={'20px'} fontSize={'14px '} color={'gray.400'}>
							{moment(createAt).fromNow()}
						</Text>
					</Box>
					<Box
						p={3}
						borderRadius={
							placement === 'left' ? '0px 10px 10px 10px' : '10px 0px 10px 10px'
						}
						bgColor={colorMode == 'dark' ? (placement == 'left' ? 'hu-Green.normal' : 'gray.500'): (placement == 'left' ? 'hu-Green.lightH' : '#e8eef3')}
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
