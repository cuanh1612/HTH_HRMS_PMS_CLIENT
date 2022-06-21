import { GridItem, HStack, Text } from '@chakra-ui/react'
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
	return (
		<Link href={link} passHref>
			<GridItem
				cursor={'pointer'}
				bg={bg}
				borderLeft={'5px solid'}
				borderColor={borderColor}
				w="100%"
				paddingInline={6}
				paddingBlock={4}
				borderRadius={10}
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
