import { HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export const ButtonRoom = ({handle, isDisabled = true, iconOpen, iconClose, title}: {title: string, handle: any, isDisabled?: boolean, iconOpen: any, iconClose: any}) => {
	return (
		<VStack>
			<HStack
				cursor={'pointer'}
				onClick={handle}
				justifyContent={'center'}
				bg={isDisabled ? 'hu-Green.normal' : '#27292b'}
				w={'40px'}
				height={'40px'}
				borderRadius={5}
				color={'white'}
			>
				{isDisabled ? iconOpen : iconClose}
			</HStack>
			<Text color={'white'} opacity={'0.5'}>
				{title}
			</Text>
		</VStack>
	)
}
