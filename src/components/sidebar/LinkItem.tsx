import { Button, HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ILinkItem } from 'type/element/commom'

export default function LinkItem({ title, icon, link }: ILinkItem) {
	const [paths, setPaths] = useState<string[]>()
	const { pathname } = useRouter()

	useEffect(() => {
		if (pathname) {
			const result = pathname.split('/').map((item) => `/${item}`)
			setPaths(result)
		}
	}, [pathname])

	return (
		<Link passHref href={link}>
			<Button
				color={!paths?.includes(link) ? 'gray.400' : 'hu-Green.normal'}
				bg={paths?.includes(link) ? 'gray.100' : 'transparent'}
				justifyContent={'start'}
				leftIcon={icon}
				height={'40px'}
				minH={'40px'}
				borderRight={'5px solid'}
				borderColor={!paths?.includes(link) ? 'transparent' : 'hu-Green.normal'}
				borderRadius={'5px 0px 0px 5px'}
				w={'full'}
				_focus={{
					outline: 'none',
				}}
				_hover={{
					borderRight: '5px solid',
					borderColor: 'hu-Green.lightA',
					color: 'hu-Green.normal',
				}}
				variant={'ghost'}
			>
				<HStack marginLeft={2} w={'full'} justifyContent={'space-between'}>
					<Text>{title}</Text>
				</HStack>
			</Button>
		</Link>
	)
}
