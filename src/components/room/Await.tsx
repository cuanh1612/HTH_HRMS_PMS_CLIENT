import { Avatar, AvatarGroup, Box, Center, Text, VStack } from '@chakra-ui/react'
import { Loading } from 'components/common'
import React from 'react'
import { roomType } from 'type/basicTypes'

export const Await = ({room}: {room: roomType}) => {
  return (
    <Center w={'full'} h={'full'} display={'flex'} flexDir="column">
					<VStack w={'full'} maxW={'400px'} spacing={2}>
						<AvatarGroup size={'sm'} max={5}>
							{room.employees.map((empl, key) => (
								<Avatar key={key} name={empl.name} src={empl.avatar?.url} />
							))}
							{room.clients.map((client, key) => (
								<Avatar key={key} name={client.name} src={client.avatar?.url} />
							))}
						</AvatarGroup>
						<Box>
							<Text textAlign={'center'} fontWeight={'bold'} fontSize={'2xl'}>
								{room.title.replace(/-/g, ' ')}
							</Text>
							<Text textAlign={'center'} color={'gray'} fontSize={'lg'}>
								{room.description} gsf esfwe we wer3w wef wf wwe we ewew
								we wewe{' '}
							</Text>
						</Box>
						<Box w={'200px'} height={'15px'} position={'relative'}>
							<Loading />
						</Box>
						<Box>
							<Text mb={'5px'} textAlign={'center'} fontSize={'lg'}>
								The meeting started on
							</Text>
							<Text textAlign={'center'} fontWeight={'bold'} fontSize={'3xl'}>
								{`${new Date(room.date).getDate()}-${
									new Date(room.date).getMonth() + 1
								}-${new Date(room.date).getFullYear()} ${
									room.start_time
								}`}
							</Text>
						</Box>
					</VStack>
				</Center>
  )
}
