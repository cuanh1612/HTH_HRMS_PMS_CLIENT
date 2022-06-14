import { HStack, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext } from 'react'

export const ButtonRoom = ({
	handle,
	isDisabled = false,
	isClose = true,
	iconOpen,
	iconClose,
	title,
}: {
	title: string
	handle: any
	isDisabled?: boolean
	isClose?: boolean
	iconOpen: any
	iconClose: any
}) => {
	const {setToast} = useContext(AuthContext)
	return (
		<VStack>
			<HStack
				cursor={'pointer'}
				onClick={() => {
					if (!isDisabled) {
						return handle()
					}
					setToast({
						type: 'warning',
						msg: 'You not allow to use'
					})
				}}
				justifyContent={'center'}
				bg={isClose ? 'hu-Green.normal' : '#27292b'}
				w={'40px'}
				height={'40px'}
				borderRadius={5}
				color={'white'}
			>
				{isClose ? iconOpen : iconClose}
			</HStack>
			<Text color={'white'} opacity={'0.5'}>
				{title}
			</Text>
		</VStack>
	)
}
