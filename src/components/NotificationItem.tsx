import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { notificationType } from 'type/basicTypes'

export interface INotificationItemProps {
    notification: notificationType
}

export default function NotificationItem({notification}: INotificationItemProps) {
	return (
		<Link href={notification.url} passHref>
			<Box
				w={'full'}
				p={4}
				borderBottom={'1px'}
				bgColor={'white'}
				borderColor={'#e8eef3'}
				cursor={'pointer'}
			>
				<a>{notification.content}</a>
			</Box>
		</Link>
	)
}
