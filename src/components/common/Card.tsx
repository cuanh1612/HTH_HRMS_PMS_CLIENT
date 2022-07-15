import { GridItem, HStack, Text, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface ICard {
	text: number | string
	bg: string
	borderColor: string
	title: string
	icon: any
	link: string
}
export const Card = ({ text, bg, borderColor, title, icon, link }: ICard) => {
	const {colorMode} = useColorMode()
	return (
		<Link href={link} passHref>
			<GridItem
				cursor={'pointer'}
				bg={colorMode != 'light' ? borderColor: bg}
				borderLeft={'5px solid'}
				borderColor={colorMode == 'light' ? borderColor: bg}
				w="100%"
				paddingInline={6}
				paddingBlock={4}
				borderRadius={10}
				color={'black'}
			>
				<HStack spacing={4}>
					{icon}
					<Text fontWeight={'semibold'}>{title}</Text>
				</HStack>
				<Text mt={2} fontSize={32} fontWeight={'bold'}>
					{text}
				</Text>
			</GridItem>
		</Link>
	)
}
