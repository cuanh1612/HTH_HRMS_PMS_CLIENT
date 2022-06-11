import { createProjectDiscussionReplyForm, updateProjectDiscussionReplyForm } from 'type/form/basicFormType'
import { projectdiscussionReplyMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle get all reply of a discussion
export const allRepliesByDiscussionRequest = async (url: string) => {
	return await getData<projectdiscussionReplyMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle get detail reply of a discussion
export const detailDiscussionReplyRequest = async (url: string) => {
	return await getData<projectdiscussionReplyMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}


//Function handle create project discussion reply
export async function createProjectDiscussionReplyRequest(
	inputCreate: createProjectDiscussionReplyForm
) {
	const resultFetch = await postData<projectdiscussionReplyMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-discussion-replies`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update project discussion reply
export async function updateProjectDiscussionReplyRequest(
	inputUpdate: updateProjectDiscussionReplyForm
) {
	const resultFetch = await putData<projectdiscussionReplyMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-discussion-replies/${inputUpdate.discussionReplyId}`,
		body: inputUpdate,
	})

	return resultFetch
}
