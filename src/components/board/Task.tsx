import {
	Avatar,
	AvatarGroup,
	Box,
	HStack,
	IconButton,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { AiOutlineFile } from 'react-icons/ai'
import { BiMessageDots } from 'react-icons/bi'
import { MdOutlineMoreVert } from 'react-icons/md'

export default function Task({
	data,
	index,
}: {
	data: {
		title: string
		id: string
	}
	index: number
}) {
	const { colorMode } = useColorMode()
	return (
		<Draggable draggableId={data.id} index={index}>
			{(provided, snapShot) => {
				return (
					<VStack
						overflow={'hidden'}
						alignItems={'flex-start'}
						spacing={4}
						bg={colorMode == 'dark' ? '#1a202c' : 'white'}
						borderRadius={10}
						marginBottom={4}
						border={ snapShot.isDragging ? '2px solid': (colorMode == 'dark' ? undefined : '2px solid')}
						borderColor={ snapShot.isDragging ? 'hu-Green.normal' : (colorMode == 'dark' ? undefined : 'gray.400')}
						padding={4}
						ref={provided.innerRef}
						{...provided.draggableProps}
                        boxShadow={`10px 10px 10px 0px ${colorMode == 'light' ? '#1a202c29': '#ffffff00'}`}
					>
						<HStack w={'full'} justifyContent={'space-between'} alignItems={'center'}>
							<Text
								fontSize={'xl'}
								{...provided.dragHandleProps}
								fontWeight={'medium'}
							>
								{data.title}
							</Text>
							<IconButton
								variant={'ghost'}
								aria-label="more"
								icon={<MdOutlineMoreVert />}
							/>
						</HStack>
						<Text
							fontSize={'sm'}
							color={colorMode == 'dark' ? 'white' : 'black'}
							opacity={0.5}
						>
							14-12-2001
						</Text>
						<Box w={'full'} bg={'#3a4f781f'} borderRadius={10} h={'120px'}></Box>
						<Text
							width={'full'}
							color={colorMode == 'dark' ? 'white' : 'black'}
							opacity={0.5}
							isTruncated
						>
							nguyen quang hoang dang ban, ban co the goi khi khac, hom nay rat vui ve
						</Text>
						<HStack w={'full'} justifyContent={'space-between'}>
							<HStack spacing={4}>
								<HStack h={'full'} alignItems={'center'} justifyContent={'center'}>
									<BiMessageDots
										color={colorMode == 'dark' ? 'white' : 'black'}
										opacity={0.5}
										fontSize={'18px'}
									/>
									<Text>3</Text>
								</HStack>
								<HStack h={'full'} alignItems={'center'} justifyContent={'center'}>
									<AiOutlineFile
										color={colorMode == 'dark' ? 'white' : 'black'}
										opacity={0.5}
										fontSize={'18px'}
									/>
									<Text>4</Text>
								</HStack>
							</HStack>
							<AvatarGroup size="sm" max={2}>
								<Avatar name="Ryan Florence" />
								<Avatar name="Segun Adebayo" />
								<Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
								<Avatar
									name="Prosper Otemuyiwa"
									src="https://bit.ly/prosper-baba"
								/>
								<Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
							</AvatarGroup>
						</HStack>
					</VStack>
				)
			}}
		</Draggable>
	)
}
