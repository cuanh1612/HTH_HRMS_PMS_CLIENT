import {
	Avatar,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
	VStack,
	Button,
	Text,
	AvatarGroup,
	IconButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { IoEyeOutline, IoVideocamOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { roomType } from 'type/basicTypes'

export const Cards = ({
	data,
	showAlertDl,
	showUpdate,
	isEdit = true,
}: {
	data: roomType[]
	showAlertDl?: any
	showUpdate?: any
	isEdit?: boolean
}) => {
	return (
		<>
			{data.map((item, key) => (
				<SimpleGrid>
					<VStack
						overflow={'hidden'}
						paddingTop={4}
						key={key}
						bg="hu-Green.dark"
						borderRadius={'10px'}
						alignItems={'start'}
						boxShadow={'5px 5px 10px 0px #00000025'}
					>
						<HStack w={'full'} paddingInline={5} justifyContent={'space-between'}>
							<HStack spacing={4}>
								<Avatar size={'sm'} name={item.empl_create.name} />
								<Text color={'white'}>{item.empl_create.name}</Text>
							</HStack>
							{isEdit && (
								<Menu>
									<MenuButton as={Button} paddingInline={3}>
										<MdOutlineMoreVert />
									</MenuButton>
									<MenuList>
										<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
											View
										</MenuItem>
										<MenuItem
											onClick={() => {
												showUpdate(item.id)
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												showAlertDl(item.id)
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</MenuList>
								</Menu>
							)}
						</HStack>
						<Text
							color={'white'}
							paddingInline={5}
							isTruncated
							fontSize={'xl'}
							fontWeight={'bold'}
						>
							{item.title.replace(/-/g, ' ')}
						</Text>
						<Text color={'white'} paddingInline={5} opacity={0.6}>
							{item.date}
						</Text>
						<Text
							color={'white'}
							mb={'10px!important'}
							paddingInline={5}
							flex={1}
							opacity={0.6}
						>
							{item.description}
						</Text>
						<HStack
							color={'black'}
							paddingInline={5}
							paddingBlock={4}
							bg={'white'}
							boxSizing={'border-box'}
							borderBottomLeftRadius={'10px'}
							borderBottomRightRadius={'10px'}
							border={'1px solid black'}
							width={'full'}
							justifyContent={'space-between'}
						>
							<AvatarGroup size="sm" max={2}>
								{item.employees.map((emp, key) => (
									<Avatar key={key} name={emp.name} />
								))}
							</AvatarGroup>

							<Link passHref href={item.link}>
								<IconButton
									color={'green'}
									aria-label={'call-video'}
									icon={<IoVideocamOutline />}
								/>
							</Link>
						</HStack>
					</VStack>
				</SimpleGrid>
			))}
		</>
	)
}
