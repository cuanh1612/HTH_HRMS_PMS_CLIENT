import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { Head } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

export default function notFind() {
	const router = useRouter()
	const { handleLoading } = useContext(AuthContext)
	useEffect(() => {
		handleLoading(false)
	}, [])
	return (
		<VStack>
			<Head title={'403'} />
			<HStack justifyContent={'center'} alignItems={'center'} w={'full'}>
				<Text fontSize={'400px'} color={'gray.400'} fontWeight={'bold'}>
					4
				</Text>
				<Box pt={'50px'}>
					<Image
						transform={'rotate(45deg)'}
						src="/assets/avoid.svg"
						width={'300px'}
						h={'300px'}
					/>
				</Box>
				<Text fontSize={'400px'} color={'gray.400'} fontWeight={'bold'}>
					3
				</Text>
			</HStack>
			<VStack spacing={2} mt={'-80px!important'}>
				<Text fontWeight={'semibold'} fontSize={'32px'}>
					We are Sorry ...
				</Text>
				<VStack spacing={1} w={'full'}>
					<Text color={'gray'}>
						The page you're trying to access has restricted access.
					</Text>
					<Text color={'gray'}>Please refer to your system administrator</Text>
				</VStack>
				<Button mt={'20px!important'} onClick={() => router.back()}>Go Back</Button>
			</VStack>
		</VStack>
	)
}
