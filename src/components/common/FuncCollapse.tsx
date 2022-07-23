import { Box, Collapse, HStack, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

export const FuncCollapse = ({ children, min= false }: { children: ReactNode , min?: boolean}) => {
	const { onToggle, isOpen } = useDisclosure({
		defaultIsOpen: true,
	})
	return (
		<Box w={'full'}>
			<HStack
				
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggle}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
			>
				<Text fontWeight={'semibold'}>Function</Text>
				{isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse  in={isOpen} animateOpacity>
				<SimpleGrid
					w={'full'}
					cursor={'pointer'}
					columns={min ? [1, null, null, 2, null, 3]: [1, 2, 2, 3, null, 4]}
					spacing={10}
					pt={3}
				>
					{children}
				</SimpleGrid>
			</Collapse>
            <br />
		</Box>
	)
}
