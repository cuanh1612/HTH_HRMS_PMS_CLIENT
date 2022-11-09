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
		<VStack style={{
			transform: "translateY(-100px)"
		}} p={'25px'} h="100vh" justifyContent={'center'} alignItems={'center'}>
			<Head title={'403'} />
			<HStack justifyContent={'center'} alignItems={'center'} w={'full'}>
				<Text fontSize={['130px', '200px', '400px']} color={'gray.400'} fontWeight={'bold'}>
					4
				</Text>
				<Box pt={['70ppx','30px', '50px']}>
					<Image
						transform={'rotate(45deg)'}
						src="/assets/avoid.svg"
						width={['100px', '150px', '300px']}
						h={['100px', '150px', '300px']}
					/>
				</Box>
				<Text fontSize={['130px', '200px', '400px']} color={'gray.400'} fontWeight={'bold'}>
					3
				</Text>
			</HStack>
			<VStack  spacing={2} mt={['-20px!important', '-20px!important', '-80px!important']}>
				<Text fontWeight={'semibold'} fontSize={'32px'}>
					We are Sorry ...
				</Text>
				<VStack spacing={1} w={'full'}>
					<Text textAlign={'center'} color={'gray'}>
						The page you're trying to access has restricted access.
					</Text>
					<Text textAlign={'center'} color={'gray'}>Please refer to your system administrator</Text>
				</VStack>
				<Button mt={'20px!important'} onClick={() => router.back()}>
					Go Back
				</Button>
			</VStack>
		</VStack>
	)
}
