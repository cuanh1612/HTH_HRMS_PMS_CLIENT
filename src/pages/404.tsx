import { HStack, Text, VStack, chakra } from '@chakra-ui/react'
import { Head } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'

export default function notFind() {
	const { handleLoading } = useContext(AuthContext)
	const Iframe = chakra('iframe')
	useEffect(() => {
		handleLoading(false)
	}, [])
	return (
		<VStack
			style={{
				transform: 'translateY(-100px)',
			}}
			p={'25px'}
			h="100vh"
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Head title={'404'} />
			<HStack justifyContent={'center'} alignItems={'center'} w={'full'}>
				<Text
					fontSize={['130px', '200px', '400px']}
					fontWeight={'bold'}
					color={'hu-Green.normal'}
				>
					4
				</Text>
				{Iframe && (
					<Iframe
						w={['130px', '200px', '300px']}
						height={['130px', '200px', '300px']}
						padding={'20px'}
						marginTop={'50px'}
						src="/assets/illustrators/404.svg"
					></Iframe>
				)}
				<Text
					fontSize={['130px', '200px', '400px']}
					color={'hu-Green.normal'}
					fontWeight={'bold'}
				>
					4
				</Text>
			</HStack>
			<VStack mt={['-20px!important', '-20px!important', '-80px!important']}>
				<Text fontWeight={'semibold'} fontSize={'32px'}>
					Oh No! Error 404
				</Text>
				<Text textAlign={'center'} color={'gray'}>
					Maybe website system has broken this page. Come back to{' '}
					<Link href={'/'} passHref>
						<Text
							cursor={'pointer'}
							fontWeight={'semibold'}
							display={'inline-block'}
							color={'hu-Green.normal'}
						>
							the homepage
						</Text>
					</Link>
				</Text>
			</VStack>
		</VStack>
	)
}
