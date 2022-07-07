import { createInterviewFileForm } from 'type/form/basicFormType'
import { interviewFileMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle create interview file
export async function createInterviewFileRequest(inputCreate: createInterviewFileForm) {
	const resultFetch = await postData<interviewFileMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/interview-files`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete interview file
export async function deleteInterviewFileRequest(inputDelete: {
	interviewFileId: number
	interviewId: number
}) {
	const resultFetch = await deleteData<interviewFileMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/interview-files/${inputDelete.interviewFileId}/interview/${inputDelete.interviewId}`,
	})

	return resultFetch
}

//Function handle get all interview files
export const allInterviewFilesRequest = async (url: string) => {
	return await getData<interviewFileMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
