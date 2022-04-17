import { createDiscussionForm, updateDiscussionForm } from 'type/form/basicFormType'
import { DiscussionMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create discussion
export async function createDiscussionRequest(inputCreate: createDiscussionForm) {
	const resultFetch = await postData<DiscussionMutationResponse>({
		url: 'http://localhost:4000/api/discussions',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get all discussion
export const allDiscussionsRequest = async (url: string) => {
	return await getData<DiscussionMutationResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle delete discussion
export async function deleteDiscussionRequest({ discussionId }: { discussionId: string }) {
	const resultFetch = await deleteData<DiscussionMutationResponse>({
		url: `http://localhost:4000/api/discussions/${discussionId}`,
	})

	return resultFetch
}

//Function handle update discussion
export async function updateDiscussionRequest({
	discussionId,
	email_author,
	content,
}: updateDiscussionForm) {
	const resultFetch = await putData<DiscussionMutationResponse>({
		url: `http://localhost:4000/api/discussions/${discussionId}`,
		body: {
			email_author,
			content,
		},
	})

	return resultFetch
}
