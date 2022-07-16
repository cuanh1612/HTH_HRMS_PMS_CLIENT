import { HStack, IconButton, Input, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { ImessageRoom } from 'type/basicTypes'
import { Msg } from './Msg'
import { MenuIcons } from 'components/common'

export const MessageBar = ({
	msgs,
	handleSendMsg,
	isDisabled = false,
}: {
	msgs: ImessageRoom[]
	handleSendMsg: any
	isDisabled?: boolean
}) => {
	const { setToast } = useContext(AuthContext)

	const [msg, setMsg] = useState('')

	return (
		<>
			<VStack
				overflow={'auto'}
				spacing={6}
				alignItems={'start'}
				justifyContent={'start'}
				w={'full'}
				flex={1}
				paddingInline={4}
			>
				{msgs.map((msg, key) => (
					<Msg id={msg.id} time={msg.time} name={msg.name} key={key} text={msg.text} />
				))}
			</VStack>
			<HStack w={'full'} paddingInline={4}>
				<MenuIcons
					handle={(icon: string) => {
						setMsg((msg) => {
							return `${msg} ${icon}`
						})
					}}
				/>

				<Input
					flex={1}
					value={msg}
					onChange={(e) => setMsg(e.target.value)}
					border={'none'}
					color={'white'}
					bg={'rgba(225,225,225,0.1)'}
					placeholder="Send message"
				/>
				<IconButton
					aria-label="send msg"
					onClick={() => {
						if (isDisabled) {
							setMsg('')
							return setToast({
								type: 'warning',
								msg: 'You not allow to use',
							})
						}
						if (!msg) {
							return setToast({
								type: 'warning',
								msg: 'Pease, enter your message',
							})
						}
						handleSendMsg({ text: msg })
						setMsg('')
					}}
					icon={<AiOutlineSend />}
					fontSize={'18px'}
				/>
			</HStack>
		</>
	)
}
