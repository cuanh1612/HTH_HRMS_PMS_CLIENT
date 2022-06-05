import { AxiosError } from 'axios'
import { notificationByCurrentUserRequest } from 'requests/notification'
import useSWR from 'swr'
import { NotificationMutaionResponse } from 'type/mutationResponses'

export const NotificationByCurrentUserQuery = (isAuthenticated: boolean | null) => {
	return useSWR<NotificationMutaionResponse, AxiosError>(
		isAuthenticated ? `notifications` : null,
		notificationByCurrentUserRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
