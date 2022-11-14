import { HStack, Text, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

export const Project = ({url, title}: {url: string, title: string}) => {
    const {colorMode} = useColorMode()
	return (
		<HStack alignItems={'center'} spacing={4}>
			<Text>&#128073;</Text>
			<Link href={url} passHref>
				<Text color={colorMode == 'dark' ? 'green.200': 'green'} _hover={{ fontWeight: 'bold', cursor: 'pointer' }}>
					{title}
				</Text>
			</Link>
		</HStack>
	)
}
