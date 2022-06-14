import {
	Box,
	Grid,
	GridItem,
	HStack,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuList,
	Portal,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { ImessageRoom } from 'type/basicTypes'
import { Msg } from './Msg'
import listEmojis from 'emoji.json'
import { BsEmojiLaughing } from 'react-icons/bs'

export const MessageBar = ({
	msgs,
	handleSendMsg,
	isDisabled = false
}: {
	msgs: ImessageRoom[]
	handleSendMsg: any
	isDisabled?: boolean
}) => {
	const dataCts = useMemo(
		() => [
			{
				icon: '😀',
				title: 'Smileys & Emotion',
			},
			{
				icon: '👋',
				title: 'People & Body',
			},
			{
				icon: '🐶',
				title: 'Animals & Nature',
			},
			{
				icon: '🍉',
				title: 'Food & Drink',
			},
			{
				icon: '🌍',
				title: 'Travel & Places',
			},
			{
				icon: '🎉',
				title: 'Activities',
			},
			{
				icon: '🕶️',
				title: 'Objects',
			},
			{
				icon: '♿',
				title: 'Symbols',
			},
			{
				icon: '🚩',
				title: 'Flags',
			},
		],
		[]
	)

	const { isOpen, onOpen, onClose } = useDisclosure()
	const { setToast } = useContext(AuthContext)

	const [msg, setMsg] = useState('')
	const [category, setCategory] = useState(dataCts[0].title)
	const [dataEmojis, setDataEmojis] = useState<
		{
			codes: string
			char: string
			name: string
			category: string
			group: string
			subgroup: string
		}[]
	>([])

	useEffect(() => {
		const result = listEmojis.filter((emoji) => {
			if (emoji.group == category) {
				return emoji
			}
		})
		setDataEmojis(result)
	}, [category])

	useEffect(() => {
		console.log(dataEmojis)
	}, [dataEmojis])

	const encodeBase64 = (file: File) => {
		alert(file.size)
		if (file.size > 3200) {
			return setToast({
				type: 'error',
				msg: 'Image should not be larger than 3Mb',
			})
		}
		var reader = new FileReader()
		if (file) {
			reader.readAsDataURL(file)
			reader.onload = () => {
				handleSendMsg({ file: reader.result as string })
			}
			reader.onerror = (err) => {
				console.log(err)
			}
		}
	}

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
					<Msg
						id={msg.id}
						time={msg.time}
						name={msg.name}
						key={key}
						text={msg.text}
					/>
				))}
			</VStack>
			<HStack w={'full'} paddingInline={4}>
				<Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
					<MenuButton>
						<IconButton
							aria-label="send image"
							icon={<BsEmojiLaughing fontSize={'18px'} />}
						/>
					</MenuButton>
					<Portal>
						<MenuList w={'300px'}>
							<Box paddingInline={4}>
								<Grid
									borderBottom={'2px solid'}
									borderColor={'hu-Green.lightA'}
									templateColumns="repeat(5, 1fr)"
									gap={0}
								>
									{dataCts.map((emoji, key) => {
										return (
											<GridItem
												cursor={'pointer'}
												userSelect={'none'}
												onClick={() => {
													setCategory(emoji.title)
												}}
												key={key}
												textAlign={'center'}
												w="100%"
												h="10"
											>
												{emoji.icon}
											</GridItem>
										)
									})}
								</Grid>

								<Grid
									maxH={'300px'}
									overflow={'scroll'}
									templateColumns="repeat(5, 1fr)"
									gap={0}
									pt={4}
								>
									{dataEmojis.map((emoji, key) => {
										return (
											<GridItem
												cursor={'pointer'}
												userSelect={'none'}
												onClick={()=> {
													setMsg(msg => {
														return `${msg} ${emoji.char}`
													})
												}}
												key={key}
												textAlign={'center'}
												w="100%"
												h="10"
											>
												{emoji.char}
											</GridItem>
										)
									})}
								</Grid>
							</Box>
						</MenuList>
					</Portal>
				</Menu>
				<input
					onChange={(e) => {
						if (e.target.files) {
							const files = Array.from(e.target.files)
							encodeBase64(files[0])
						}
					}}
					style={{ display: 'none' }}
					accept=".gif,.jpg,.jpeg,.png"
					type={'file'}
					id="imageFile"
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
						if(isDisabled) {
							setMsg('')
							return setToast({
								type: 'warning',
								msg: 'You not allow to use'
							})
						}
						if(!msg) {
							return setToast({
								type: 'warning',
								msg: 'Pease, enter your message'
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
