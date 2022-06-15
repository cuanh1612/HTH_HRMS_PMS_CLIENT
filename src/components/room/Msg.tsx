import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext } from 'react'
import { ImessageRoom } from 'type/basicTypes'

export const Msg = ({ name, id, text, time }: ImessageRoom) => {
	const { currentUser } = useContext(AuthContext)

	return (
		<HStack w={'full'} spacing={4} alignItems={'start'}>
			{currentUser?.id != id && <Avatar size={'sm'} src="" name={name} />}
			<VStack spacing={4} alignItems={'start'} flex={1}>
				<Box w={'full'}>
					<Text
						dir={currentUser?.id == id ? 'rtl' : 'ltr'}
						color={currentUser?.id == id ? 'hu-Green.normal' : 'white'}
					>
						{name}
					</Text>
					<Text
						dir={currentUser?.id == id ? 'rtl' : 'ltr'}
						color={'white'}
						opacity={'0.5'}
					>
						{time}
					</Text>
				</Box>

				<HStack w={'full'} justifyContent={currentUser?.id == id ? 'end' : 'start'}>
					<Text
						dir={currentUser?.id == id ? 'rtl' : 'ltr'}
						bg={'rgba(225,225,225,0.1)'}
						backdropBlur={'10px'}
						color={'white'}
						borderRadius={
							currentUser?.id != id ? '0px 10px 10px 10px' : '10px 0px 10px 10px'
						}
						p={4}
					>
						{text}
					</Text>
				</HStack>
			</VStack>
			{currentUser?.id == id && <Avatar size={'sm'} src="" name={name} />}
		</HStack>
	)
}
