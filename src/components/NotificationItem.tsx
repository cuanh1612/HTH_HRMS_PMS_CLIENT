import { AuthContext } from 'contexts/AuthContext'
import { Box, Text } from '@chakra-ui/react'
import { deleteNotificationMutation } from 'mutations/notification'
import { useRouter } from 'next/router'
import { NotificationByCurrentUserQuery } from 'queries/notification'
import { useContext } from 'react'
import { notificationType } from 'type/basicTypes'

export interface INotificationItemProps {
	notification: notificationType
}

export default function NotificationItem({ notification }: INotificationItemProps) {
	const { isAuthenticated, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Query
	const { mutate: refetchNotifications } = NotificationByCurrentUserQuery(isAuthenticated)

	//Mutate delete notification
	const [mutateDeleteNotification] = deleteNotificationMutation(setToast)

	//Handle click notfications
	const onClickNotification = () => {
		mutateDeleteNotification(notification.id)
		refetchNotifications()
		router.push(notification.url)
	}

	return (
		<Box
			w={'full'}
			p={4}
			borderBottom={'1px'}
			bgColor={'white'}
			borderColor={'#e8eef3'}
			cursor={'pointer'}
		>
			<Text onClick={onClickNotification}>{notification.content}</Text>
		</Box>
	)
}
