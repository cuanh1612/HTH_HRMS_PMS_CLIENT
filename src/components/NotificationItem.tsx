import { AuthContext } from 'contexts/AuthContext'
import { Box, Text, useColorMode } from '@chakra-ui/react'
import { deleteNotificationMutation } from 'mutations/notification'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { notificationType } from 'type/basicTypes'
import { KeyedMutator } from 'swr'
import { NotificationMutationResponse } from 'type/mutationResponses'

export interface INotificationItemProps {
	notification: notificationType
	refetchNotifications: KeyedMutator<NotificationMutationResponse>
}

export default function NotificationItem({ notification, refetchNotifications }: INotificationItemProps) {
	const { setToast } = useContext(AuthContext)
	const router = useRouter()
	const {colorMode} = useColorMode()

	//Mutate delete notification
	const [mutateDeleteNotification] = deleteNotificationMutation(setToast)

	//Handle click notifications
	const onClickNotification = async () => {
		await mutateDeleteNotification(notification.id)
		refetchNotifications()
		router.push(notification.url)
	}

	return (
		<Box
			w={'full'}
			p={4}
			borderBottom={'1px'}
			bgColor={colorMode == 'dark'? '#2d3748': 'white'}
			borderColor={colorMode == 'dark' ? 'gray.600' : '#e8eef3'}
			cursor={'pointer'}
		>
			<Text onClick={onClickNotification}>{notification.content}</Text>
		</Box>
	)
}
