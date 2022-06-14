import { HStack, Switch, Text, VStack } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import React from 'react'

interface ISetting {
    onClose: any
    isOpen: any
    isScreen: boolean
    setIsScreen: any
    setIsSendMsg: any
    isSendMsg: boolean
    setIsAudio: any
    isAudio: boolean
    setIsVideo: any
    isVideo: boolean


}

export const Setting = ({onClose, isOpen, isScreen, setIsScreen, setIsSendMsg, isSendMsg, setIsAudio, isAudio, setIsVideo, isVideo}:ISetting) => {
	return (
		<Drawer title="Setting" onClose={onClose} size={'sm'} isOpen={isOpen}>
			<Text p={6} borderBottom={'2px solid'} borderColor={'gray.200'}>
				Use these organizer settings to take control of your meetings. Only the organizer
				has access to these controls.
			</Text>
			<Text
				fontWeight={'semibold'}
				borderBottom={'2px solid'}
				borderColor={'gray.200'}
				paddingInline={6}
				paddingBlock={4}
			>
				Coordinating the meeting
			</Text>
			<VStack spacing={4} alignItems={'start'} w={'full'} paddingInline={6} paddingBlock={4}>
				<HStack w={'full'} justifyContent={'space-between'}>
					<Text>Screen Sharing</Text>
					<Switch
						isChecked={isScreen}
						onChange={() => {
							setIsScreen(!isScreen)
						}}
						colorScheme={'green'}
					/>
				</HStack>
				<HStack w={'full'} justifyContent={'space-between'}>
					<Text>Send chat messages</Text>
					<Switch
						onChange={() => {
							setIsSendMsg(!isSendMsg)
						}}
						isChecked={isSendMsg}
						colorScheme={'green'}
					/>
				</HStack>
				<HStack w={'full'} justifyContent={'space-between'}>
					<Text>Turn on their microphone</Text>
					<Switch
						onChange={() => {
							setIsAudio(!isAudio)
						}}
						isChecked={isAudio}
						colorScheme={'green'}
					/>
				</HStack>
				<HStack w={'full'} justifyContent={'space-between'}>
					<Text>Turn on their video</Text>
					<Switch
						onChange={() => {
							setIsVideo(!isVideo)
						}}
						isChecked={isVideo}
						colorScheme={'green'}
					/>
				</HStack>
			</VStack>
		</Drawer>
	)
}
