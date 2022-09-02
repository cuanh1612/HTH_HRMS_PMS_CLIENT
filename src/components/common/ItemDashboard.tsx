import { Box, GridItem, HStack, Text, Tooltip, VStack } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { BsInfoCircle } from 'react-icons/bs'

export const ItemDashboard = ({
	children,
	title,
	alert,
    overflow = 'hidden',
	isFull = false,
	heightAuto = false 
}: {
	children: ReactNode
	title: string
	alert?: string
    overflow?: string
	isFull?: boolean
	heightAuto?: boolean
}) => {
	return (
		<GridItem colSpan={isFull ? 2: 1} pos={'relative'}>
			<VStack spacing={'4'} alignItems={'start'} w={'full'}>
				{alert ? (
					<HStack justifyContent={'center'} alignItems={'center'}>
						<Text fontWeight={'semibold'} fontSize={'xl'}>
							{title}
						</Text>
						<Tooltip
							hasArrow
							label={alert}
							bg="gray.300"
							color="black"
						>
							<Box pt={'5px'}>
								<BsInfoCircle />
							</Box>
						</Tooltip>
					</HStack>
				) : (
					<Text fontWeight={'semibold'} fontSize={'xl'}>
						{title}
					</Text>
				)}

				<Box
					w={'full'}
					padding={'20px'}
					border={'2px solid'}
					borderColor={'hu-Green.normal'}
					borderRadius={'10px'}
					h={heightAuto ? 'auto': '300px'}
					overflow={overflow}
				>
					{children}
				</Box>
			</VStack>
		</GridItem>
	)
}
