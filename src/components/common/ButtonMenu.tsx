import { Box, useColorMode, VStack } from '@chakra-ui/react'
import React from 'react'

export const ButtonMenu = ({onOpenMenu, dir}: {onOpenMenu: any, dir: string}) => {
    const {colorMode} = useColorMode()
	return (
		<VStack
			onClick={onOpenMenu}
			cursor={'pointer'}
			role="group"
			alignItems={dir}
			spacing={'6px'}
		>
			<Box
				_groupHover={{
					w: '25px',
					scale: 1.1,
				}}
				transform={'auto'}
				as="span"
				transition={'0.1s linear'}
				background={colorMode == 'light' ? 'hu-Green.normal' : 'hu-Green.light'}
				borderRadius="full"
				h={'4px'}
				w={'15px'}
				pos="relative"
				display={'block'}
			></Box>
			<Box
				_groupHover={{
					scale: 1.1,
				}}
				transform={'auto'}
				as="span"
				background={colorMode == 'light' ? 'hu-Green.normalA' : 'hu-Green.lightA'}
				borderRadius="full"
				h={'4px'}
				w={'25px'}
				pos="relative"
				display={'block'}
			></Box>
		</VStack>
	)
}
