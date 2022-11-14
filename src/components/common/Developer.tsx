import { Avatar, Box, HStack, Text, useColorMode, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BsArrowRight } from 'react-icons/bs'

interface IDeveloper {
	name: string
	description: string
	uri: string
	title: string
	email: string
	linkBio: string
	color: string
}

export const Developer = ({ name, description, uri, title, email, linkBio, color }: IDeveloper) => {
	const { colorMode } = useColorMode()
	return (
		<Box p={'20px'} bg={colorMode == 'light' ? 'white' : '#1e2636'} w={'full'} h={'full'}>
			<VStack
				w={'full'}
				h={'100%'}
				justifyContent={'center'}
				alignItems={'center'}
				spacing={8}
			>
				<Box pos={'relative'}>
					<Avatar size={'2xl'} name={name} src={uri} />
					<Box
						_groupHover={{
							transform: 'rotate(360deg)',
							transition: '0.8s',
						}}
						w={'calc(100% + 10px)'}
						h={'calc(100% + 10px)'}
						borderRadius={'full'}
						pos={'absolute'}
						top={'-5px'}
						left={'-5px'}
						border={`1px solid ${color}`}
					>
						<Box
							w={'20px'}
							h={'20px'}
							bg={color}
							borderRadius={'full'}
							border={'4px solid white'}
							pos={'absolute'}
							top={'20px'}
							right={'0px'}
						/>
					</Box>
				</Box>
				<VStack spacing={1} textAlign={'center'}>
					<Text fontSize={'lg'} fontWeight={'semibold'}>{name}</Text>
					<Text fontSize={'sm'} color={'gray.500'}>
						{email}
					</Text>
				</VStack>
			</VStack>
			<Box
				_groupHover={{
					transition: '0.5s',
					transitionDelay: '0.3s',
					left: '0px',
				}}
				w={'full'}
				bg={colorMode == 'light' ? 'white': '#212b3e'}
				h={'100%'}
				top={0}
				left={'-150%'}
				pos={'absolute'}
			>
				<VStack overflow={'auto'} h={'100%'} w={'full'}>
					<Text
						w={'full'}
						fontSize={'lg'}
						fontWeight={'semibold'}
						p={'10px 20px'}
						borderBottom={'1px solid'}
						borderColor={colorMode == 'light' ? 'gray.200' : 'gray.500'}
						pos={'sticky'}
						top={'0px'}
						zIndex={10}
						bg={colorMode == 'light' ? 'white': '#212b3e'}
					>
						{title}
					</Text>
					<VStack p={'20px'} pb={'0px'} flex={1} spacing={4} alignItems={'flex-start'} w={'full'}>
						<HStack spacing={3} alignItems={'center'}>
							<Avatar name={name} src={uri} />
							<Box>
								<Text>{name}</Text>
								<Text fontSize={'sm'} color={'gray.500'}>
									{email}
								</Text>
							</Box>
						</HStack>
						<Text color={'gray.500'}>{description}</Text>
					</VStack>
					<Link passHref href={linkBio}>
						<HStack
							_hover={{
								fontWeight: 'semibold',
							}}
							color={colorMode == 'light' ? 'green': 'green.200'}
							p={' 20px'}
							justifyContent={'space-between'}
							w={'full'}
						>
							<Text>More</Text>
							<BsArrowRight />
						</HStack>
					</Link>
				</VStack>
			</Box>
		</Box>
	)
}
