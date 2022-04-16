import { createDiscussionForm } from 'type/form/basicFormType'
import { DiscussionMutationResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create discussion
export async function createDiscussionRequest(inputCreate: createDiscussionForm) {
	const resultFetch = await postData<DiscussionMutationResponse>({
		url: 'http://localhost:4000/api/discussions',
		body: inputCreate,
	})

	return resultFetch
}
