import { HStack, Text, useColorMode, VStack } from '@chakra-ui/react'
import React from 'react'

interface Ifunc {
	icon: any
	title: string
	description: string
	action: any
	disabled?: boolean
}

export const Func = ({ icon, title, description, action, disabled = false }: Ifunc) => {
	const { colorMode } = useColorMode()
	return (
		<HStack
			transition={'0.2s'}
			_hover={{
				bg: disabled ? '' : 'hu-Green.light',
				color: 'black',
			}}
			borderRadius={10}
			spacing={5}
			p={4}
			height="auto"
			bg={disabled ? 'gray.300' : ''}
			color={colorMode == 'dark' && disabled ? 'black' : undefined}
			onClick={() => {
				if (!disabled) {
					action()
				}
			}}
		>
			<HStack
				justifyContent={'center'}
				color={
					colorMode == 'dark'
						? disabled
							? 'gray'
							: 'white'
						: disabled
						? 'gray'
						: 'hu-Green.normal'
				}
				w={'50px'}
				minW={'50px'}
				h={'50px'}
				borderRadius={'full'}
				bg={colorMode == 'dark' ? disabled ? 'gray.200' : 'hu-Green.normalA' : disabled ? 'gray.200' : 'hu-Green.lightA'}
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
