import { AxiosError } from 'axios'
import { notificationByCurrentUserRequest } from 'requests/notification'
import useSWR from 'swr'
import { NotificationMutationResponse } from 'type/mutationResponses'

export const NotificationByCurrentUserQuery = (isAuthenticated: boolean | null) => {
	return useSWR<NotificationMutationResponse, AxiosError>(
		isAuthenticated ? `notifications` : null,
		notificationByCurrentUserRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
