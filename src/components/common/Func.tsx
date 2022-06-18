import { HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

interface Ifunc {
	icon: any
	title: string
	description: string
	action: any
	disabled?: boolean
}

export const Func = ({ icon, title, description, action, disabled = false }: Ifunc) => {
	return (
		<HStack
			transition={'0.2s'}
			_hover={{
				bg: disabled ? '' : 'hu-Green.light',
			}}
			borderRadius={10}
			spacing={5}
			p={4}
			height="auto"
			bg={disabled ? 'gray.300' : ''}
			onClick={() => {
				if (!disabled) {
					action()
				}
			}}
		>
			<HStack
				justifyContent={'center'}
				color={disabled ? 'gray' : 'hu-Green.normal'}
				w={'50px'}
				minW={'50px'}
				h={'50px'}
				borderRadius={'full'}
				bg={disabled ? 'gray.200' : 'hu-Green.lightA'}
			>
				{icon}
			</HStack>
			<VStack alignItems={'start'}>
				<Text fontWeight={'semibold'}>{title}</Text>
				<Text color={'gray'} fontSize={'14px'}>
					{description}
				</Text>
			</VStack>
		</HStack>
	)
}
