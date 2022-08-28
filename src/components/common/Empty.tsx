import { Text, VStack } from '@chakra-ui/react'
import React from 'react'

export const Empty = ({height}: {height: string}) => {
	return (
		<VStack>
			<iframe
				src="/assets/illustrators/empty2.svg"
				style={{
					width: '100%',
					height,
					opacity: 0.5,
				}}
			></iframe>
			<Text color={'gray.300'} fontWeight={'semibold'}>
				Empty data
			</Text>
		</VStack>
	)
}
