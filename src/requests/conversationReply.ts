import { createConversationReplyForm } from 'type/form/basicFormType'
import { ConversationReplyMutationResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//Function handle get all coversations replies by conversation
export const allConversationRepliesByConversationRequest = async (url: string) => {
	return await getData<ConversationReplyMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create conversation reply
export async function createConversationReplyRequest(inputCreate: createConversationReplyForm) {
	const resultFetch = await postData<ConversationReplyMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/conversation-replies`,
		body: inputCreate,
	})

	return resultFetch
}