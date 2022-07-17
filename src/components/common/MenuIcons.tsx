import { Box, Grid, GridItem, IconButton, Menu, MenuButton, MenuList, Portal, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { BsEmojiLaughing } from 'react-icons/bs'
import listEmojis from 'emoji.json'

export const MenuIcons = ({handle, isDisable = false}: {handle: any, isDisable?: boolean}) => {
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
    const [category, setCategory] = useState(dataCts[0].title)

    useEffect(() => {
		const result = listEmojis.filter((emoji) => {
			return emoji.group == category
		})
		setDataEmojis(result)
	}, [category])

	return (
		<Menu isOpen={isDisable ? false : isOpen} onOpen={onOpen} onClose={onClose}>
			<MenuButton>
				<IconButton disabled={isDisable} aria-label="send image" icon={<BsEmojiLaughing fontSize={'18px'} />} />
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
										onClick={() => {
                                            handle(emoji.char)
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
	)
}
