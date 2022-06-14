import { Avatar, Box, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { useParticipant } from '@daily-co/daily-react-hooks'
import React from 'react'
import { BiMicrophone } from 'react-icons/bi'
import { BsCameraVideo } from 'react-icons/bs'
import { MdOutlineMoreVert } from 'react-icons/md'
import { VscPinned, VscPinnedDirty } from 'react-icons/vsc'

export const Participant = ({
	id,
	localId,
	handleSendMsg,
	setPinId,
	pinId
}: {
	id: string
	localId?: string
	handleSendMsg: any
	setPinId: any
	pinId?: string
}) => {
	const participant = useParticipant(id)
	return (
		<>
			<HStack w={'full'} spacing={4} justifyContent={'start'}>
				<Avatar size={'sm'} name={participant?.user_name} />
				<Box overflow={'hidden'} w={'full'} color={'white'}>
					<Text isTruncated>
						{participant?.user_name} {id == localId && '(You)'}
					</Text>
				</Box>
				{id != localId && (
					<Menu>
						<MenuButton>
							<MdOutlineMoreVert color={'white'} />
						</MenuButton>
						<MenuList>
							<MenuItem
								onClick={() => {
									if(pinId != id) {
										setPinId(id)
									} else {
										setPinId('')
									}
								}}
								icon={ pinId != id ? <VscPinned fontSize={'15px'} /> : <VscPinnedDirty fontSize={'15px'} />}
							>
								Pin
							</MenuItem>
							<MenuItem
								icon={<BiMicrophone fontSize={'15px'} />}
								onClick={() => {
									handleSendMsg({
										field: 'audio',
										isField: false,
										peerId: id,
									})
								}}
							>
								Stop Audio
							</MenuItem>
							<MenuItem
								icon={<BsCameraVideo fontSize={'15px'} />}
								onClick={() => {
									handleSendMsg({
										field: 'video',
										isField: false,
										peerId: id,
									})
								}}
							>
								Stop Video
							</MenuItem>
						</MenuList>
					</Menu>
				)}
			</HStack>
		</>
	)
}
