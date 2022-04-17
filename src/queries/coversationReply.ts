import { AxiosError } from 'axios'
import { allConversationRepliesByConversationRequest } from 'requests/conversationReply'
import useSWR from 'swr'
import { ConversationReplyMutationResponse } from 'type/mutationResponses'

export const allConversationRepliesByConversationQuery = (
	isAuthenticated: boolean | null,
	conversationId: number | undefined
) => {
	return useSWR<ConversationReplyMutationResponse, AxiosError>(
		isAuthenticated && conversationId
			? `conversation-replies/conversation/${conversationId}`
			: null,
		allConversationRepliesByConversationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
