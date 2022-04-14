import { createConversationReplyForm } from 'type/form/basicFormType'
import { ConversationReplyMutationResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//Function handle get all coversations replies by conversation
export const allConversationRepliesByConversationRequest = async (url: string) => {
	return await getData<ConversationReplyMutationResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create conversation reply
export async function createConversationReplyRequest(inputCreate: createConversationReplyForm) {
	const resultFetch = await postData<ConversationReplyMutationResponse>({
		url: 'http://localhost:4000/api/conversation-replies',
		body: inputCreate,
	})

	return resultFetch
}