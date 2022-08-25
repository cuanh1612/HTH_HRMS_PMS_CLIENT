import { HStack, Text, VStack } from '@chakra-ui/react'
import { Head } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'

export default function notFind() {
	const { handleLoading } = useContext(AuthContext)
	useEffect(() => {
		handleLoading(false)
	}, [])
	return (
		<VStack>
			<Head title={'404'}/>
			<HStack justifyContent={'center'} alignItems={'center'} w={'full'}>
				<Text fontSize={'400px'} color={'hu-Green.normal'} fontWeight={'bold'}>
					4
				</Text>
				<iframe
					src="/assets/illustrators/404.svg"
					style={{
						width: '300px',
						height: '400px',
						padding: '20px',
						marginTop: '50px',
					}}
				></iframe>
				<Text fontSize={'400px'} color={'hu-Green.normal'} fontWeight={'bold'}>
					4
				</Text>
			</HStack>
			<VStack mt={'-80px!important'}>
				<Text fontWeight={'semibold'} fontSize={'32px'}>
					Oh No! Error 404
				</Text>
				<Text color={'gray'}>
					Maybe website system has broken this page. Come back to{' '}
					<Link href={'/'} passHref>
						<Text cursor={'pointer'} fontWeight={'semibold'} display={'inline-block'} color={'hu-Green.normal'}>the homepage</Text>
					</Link>
				</Text>
			</VStack>
		</VStack>
	)
}
