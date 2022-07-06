import {
	createInterviewForm,
	deleteInterviewsForm,
	updateInterviewForm,
} from 'type/form/basicFormType'
import { deleteData, getData, postData, putData } from 'utils/fetchData'
import { interviewMutationResponse } from 'type/mutationResponses'

//Function handle create interviews
export async function createinterviewRequest(inputCreate: createInterviewForm) {
	const resultFetch = await postData<interviewMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/interviews`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update interviews
export async function updateInterviewlRequest(inputUpdate: updateInterviewForm) {
	const resultFetch = await putData<interviewMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/interviews/${inputUpdate.interviewId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all or detail interview
export const getInterviewRequest = async (url: string) => {
	return await getData<interviewMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete interview
export async function deleteInterviewRequest(interviewId: string | number) {
	const resultFetch = await deleteData<interviewMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/interviews/${interviewId}`,
	})

	return resultFetch
}

//Function handle delete many intervew
export async function deleteManyInterviewsRequest(inputDelete: deleteInterviewsForm) {
	const resultFetch = await putData<interviewMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/interviews/delete-many`,
		body: inputDelete,
	})

	return resultFetch
}
