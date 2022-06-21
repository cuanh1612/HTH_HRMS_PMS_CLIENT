import { GridItem, HStack, Text } from '@chakra-ui/react'
import React from 'react'

interface ICard {
    text: number | string
    bg: string
    borderColor: string
    title: string
    icon: any
}
export const Card = ({text, bg, borderColor, title, icon}:ICard) => {
	return (
		<GridItem
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
	)
}
