import { createDiscussionForm, updateDiscussionForm } from 'type/form/basicFormType'
import { DiscussionMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create discussion
export async function createDiscussionRequest(inputCreate: createDiscussionForm) {
	const resultFetch = await postData<DiscussionMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/discussions`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get all discussion
export const allDiscussionsRequest = async (url: string) => {
	return await getData<DiscussionMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete discussion
export async function deleteDiscussionRequest({ discussionId }: { discussionId: string }) {
	const resultFetch = await deleteData<DiscussionMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/discussions/${discussionId}`,
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
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/discussions/${discussionId}`,
		body: {
			email_author,
			content,
		},
	})

	return resultFetch
}
