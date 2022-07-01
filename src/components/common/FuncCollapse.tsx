import { Collapse, HStack, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

export const FuncCollapse = ({ children }: { children: ReactNode }) => {
	const { onToggle, isOpen } = useDisclosure({
		defaultIsOpen: true,
	})
	return (
		<>
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
			<Collapse in={isOpen} animateOpacity>
				<SimpleGrid
					w={'full'}
					cursor={'pointer'}
					columns={[1, 2, 2, 3, null, 4]}
					spacing={10}
					pt={3}
				>
					{children}
				</SimpleGrid>
			</Collapse>
            <br />
		</>
	)
}
