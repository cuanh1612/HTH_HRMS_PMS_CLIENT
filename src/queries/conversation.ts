import { AxiosError } from 'axios'
import { allCoversationsByUserRequest } from 'requests/conversation'
import useSWR from 'swr'
import { ConversationMutationResponse } from 'type/mutationResponses'

export const allConversationsByUserQuery = (isAuthenticated: boolean | null, userId: number | undefined) => {
	return useSWR<ConversationMutationResponse, AxiosError>(
		isAuthenticated && userId ? `conversations/user/${userId}` : null,
		allCoversationsByUserRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
