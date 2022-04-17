import { createConversationForm } from 'type/form/basicFormType'
import { ConversationMutationResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//Function handle create conversation
export async function createConversationRequest(inputCreate: createConversationForm) {
	const resultFetch = await postData<ConversationMutationResponse>({
		url: 'http://localhost:4000/api/conversations',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get all coversations by user
export const allCoversationsByUserRequest = async (url: string) => {
	return await getData<ConversationMutationResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
