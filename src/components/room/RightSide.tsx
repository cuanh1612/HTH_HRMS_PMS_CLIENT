import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	useBreakpoint,
	VStack,
} from '@chakra-ui/react'
import { DailyCall } from '@daily-co/daily-js'
import { ExtendedDailyParticipant } from '@daily-co/daily-react-hooks'
import React from 'react'
import { ImessageRoom, ITile } from 'type/basicTypes'
import { MessageBar } from './MessageBar'
import { Participant } from './Participant'

interface IRightSide {
	tiles: ITile[]
	isShowMsgBar: boolean
	setIsShowMsgBar: any
	co: DailyCall | null
	isYourMsg: boolean
	handleSendMsg: any
	setPinId: any
	pinId?: string
	msgs: ImessageRoom[]
	localParticipant: ExtendedDailyParticipant | null
    isOpen: boolean
    onClose: any
}

export default function RightSide({
	tiles,
	isShowMsgBar,
	setIsShowMsgBar,
	co,
	isYourMsg,
	handleSendMsg,
	setPinId,
	pinId,
	msgs,
	localParticipant,
    isOpen,
    onClose
}: IRightSide) {
	const layoutSize = useBreakpoint()
	if (layoutSize?.includes('xl')) {
		return (
			<Box pt={8} pb={9} w={'350px'} h={'100%'} minW={'300px'}>
				<VStack
					alignItems={'start'}
					justifyContent={'start'}
					spacing={5}
					paddingBlock={4}
					w={'full'}
					h={'100%'}
					bg={'#2b2d2e'}
					borderRadius={15}
				>
					<Box paddingInline={4} w={'full'}>
						<HStack
							borderRadius={'10px'}
							p={2}
							spacing={4}
							h={'50px'}
							w={'full'}
							bg={'rgba(225,225,225,0.1)'}
						>
							<Button
								onClick={() => setIsShowMsgBar(true)}
								_hover={{
									color: 'black',
									bg: 'hu-Green.normal',
								}}
								w={'full'}
								bg={isShowMsgBar ? 'hu-Green.lightA' : ''}
								variant={isShowMsgBar ? 'solid' : 'ghost'}
								color={isShowMsgBar ? 'black' : 'white'}
								fontWeight={!isShowMsgBar ? 'normal' : 'semibold'}
							>
								Messages ({msgs.length})
							</Button>
							<Button
								onClick={() => setIsShowMsgBar(false)}
								_hover={{
									color: 'black',
									bg: 'hu-Green.normal',
								}}
								w={'full'}
								fontWeight={isShowMsgBar ? 'normal' : 'semibold'}
								bg={!isShowMsgBar ? 'hu-Green.lightA' : ''}
								variant={!isShowMsgBar ? 'solid' : 'ghost'}
								color={!isShowMsgBar ? 'black' : 'white'}
							>
								Participant ({co?.participantCounts().present})
							</Button>
						</HStack>
					</Box>
					{isShowMsgBar ? (
						<MessageBar
							isDisabled={!isYourMsg}
							msgs={msgs}
							handleSendMsg={handleSendMsg}
						/>
					) : (
						<VStack
							alignItems={'start'}
							w={'full'}
							overflow={'auto'}
							h={'100%'}
							spacing={5}
							paddingInline={4}
						>
							{tiles.map((tile, key) => (
								<Participant
									id={tile.id}
									key={key}
									localId={localParticipant?.user_id}
									handleSendMsg={handleSendMsg}
									setPinId={setPinId}
									pinId={pinId}
								/>
							))}
						</VStack>
					)}
				</VStack>
			</Box>
		)
	}
	return (
		<Drawer isOpen={isOpen} size={'sm'} placement="right" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton color={'white'} />
				<DrawerHeader bg={'#2b2d2e'} color={'white'}>Message & participants</DrawerHeader>

				<DrawerBody pb={6} paddingInline={'0px'} bg={'#2b2d2e'}>
						<VStack
							alignItems={'start'}
							justifyContent={'start'}
							spacing={5}
							w={'full'}
							h={'100%'}
							bg={'#2b2d2e'}
						>
							<Box paddingInline={4} w={'full'}>
								<HStack
									borderRadius={'10px'}
									p={2}
									spacing={4}
									h={'50px'}
									w={'full'}
									bg={'rgba(225,225,225,0.1)'}
								>
									<Button
										onClick={() => setIsShowMsgBar(true)}
										_hover={{
											color: 'black',
											bg: 'hu-Green.normal',
										}}
										w={'full'}
										bg={isShowMsgBar ? 'hu-Green.lightA' : ''}
										variant={isShowMsgBar ? 'solid' : 'ghost'}
										color={isShowMsgBar ? 'black' : 'white'}
										fontWeight={!isShowMsgBar ? 'normal' : 'semibold'}
									>
										Messages ({msgs.length})
									</Button>
									<Button
										onClick={() => setIsShowMsgBar(false)}
										_hover={{
											color: 'black',
											bg: 'hu-Green.normal',
										}}
										w={'full'}
										fontWeight={isShowMsgBar ? 'normal' : 'semibold'}
										bg={!isShowMsgBar ? 'hu-Green.lightA' : ''}
										variant={!isShowMsgBar ? 'solid' : 'ghost'}
										color={!isShowMsgBar ? 'black' : 'white'}
									>
										Participant ({co?.participantCounts().present})
									</Button>
								</HStack>
							</Box>
							{isShowMsgBar ? (
								<MessageBar
									isDisabled={!isYourMsg}
									msgs={msgs}
									handleSendMsg={handleSendMsg}
								/>
							) : (
								<VStack
									alignItems={'start'}
									w={'full'}
									overflow={'auto'}
									h={'100%'}
									spacing={5}
									paddingInline={4}
								>
									{tiles.map((tile, key) => (
										<Participant
											id={tile.id}
											key={key}
											localId={localParticipant?.user_id}
											handleSendMsg={handleSendMsg}
											setPinId={setPinId}
											pinId={pinId}
										/>
									))}
								</VStack>
							)}
						</VStack>
				
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	)
}
