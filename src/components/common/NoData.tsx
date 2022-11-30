import { Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export const NoData = () => {
	return (
		<Box>
			<iframe
				src="/assets/illustrators/empty.svg"
				style={{
					width: '100%',
					height: '300px',
					opacity: 0.5,
				}}
			></iframe>
			<VStack spacing={1} mt={'-40px'}>
				<Text fontWeight={'bold'} fontSize={'28px'} textAlign={'center'}>
					There's no any information
				</Text>
				<Text color={'gray'} textAlign={'center'}>
					Please, add new item or reload this page!
				</Text>
			</VStack>
		</Box>
	)
}
