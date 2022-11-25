import {
	Avatar,
	Box,
	Button,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { UserAttendance } from 'type/basicTypes'
import { getMinutes, setTime } from 'utils/time'

interface IDetailAttendance {
	isOpenDetail: boolean
	onCloseDetail: () => void
	onOpenInsert: () => void
	user?: UserAttendance
	values: any
}

export default function DetailAttendance({
	isOpenDetail,
	onCloseDetail,
	onOpenInsert,
	user,
	values,
}: IDetailAttendance) {
	return (
		<Modal isOpen={isOpenDetail} onClose={onCloseDetail}>
			<ModalOverlay />
			<ModalContent maxW={'350px'} marginInline={'20px'}>
				<ModalHeader>
					<HStack spacing={5}>
						<Text as="span">
							{user &&
								new Date(user.date).getDate() +
									'-' +
									(new Date(user.date).getMonth() + 1) +
									'-' +
									new Date(user.date).getFullYear()}
						</Text>
						{values['late'] && (
							<HStack fontWeight={'normal'}>
								<FiAlertTriangle color="orange" />{' '}
								<Text as="span" color={'gray'} fontWeight={'normal'}>
									Late
								</Text>
							</HStack>
						)}
					</HStack>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack alignItems={'flex-start'} spacing={5}>
						<HStack minW={'200px'} alignItems={'flex-start'} spacing={3}>
							<Avatar name={user?.name} src={user?.avatar} />
							<Box w={'full'}>
								<Text fontWeight={'semibold'}>{user?.name}</Text>
								<Text color={'gray'} fontSize={'14px'}>
									{user?.designation}
								</Text>
							</Box>
						</HStack>
						<Text>
							<Text as={'span'} color={'gray'}>
								Working from:
							</Text>{' '}
							{values['working_from']}
						</Text>

						<HStack spacing={5}>
							<Input
								readOnly
								value={
									String(values['clock_in_time']).split(' ')[1]
										? String(values['clock_in_time'])
										: setTime(String(values['clock_in_time'])).time || ''
								}
							/>
							<Input
								readOnly
								value={
									String(values['clock_out_time']).split(' ')[1]
										? String(values['clock_out_time'])
										: setTime(String(values['clock_out_time'])).time || ''
								}
							/>
						</HStack>

						<Box
							w={'full'}
							display={'flex'}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<Box
								textAlign={'center'}
								lineHeight={'90px'}
								width={'120px'}
								h={'120px'}
								borderRadius={'full'}
								border={'4px solid'}
								borderColor={'hu-Green.normal'}
								pos={'relative'}
							>
								<Text whiteSpace={'nowrap'} p={2} color={'hu-Green.normal'}>
									{`${getMinutes(
										String(values['clock_in_time']),
										String(values['clock_out_time'])
									)}`}
								</Text>
							</Box>
						</Box>
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="red" variant={'ghost'} mr={3} onClick={onCloseDetail}>
						Close
					</Button>
					<Button
						bg={'hu-Green.normal'}
						onClick={() => {
							onCloseDetail()
							onOpenInsert()
						}}
						color={'white'}
					>
						Update
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
