import { Text, VStack } from '@chakra-ui/react'
import React from 'react'

export const Empty = ({height}: {height: string}) => {
	return (
		<VStack>
		
			<Text color={'gray.300'} fontWeight={'semibold'}>
				Empty data
			</Text>
		</VStack>
	)
}
