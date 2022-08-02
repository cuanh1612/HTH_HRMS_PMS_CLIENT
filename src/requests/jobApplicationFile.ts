import { createJobApplicationFileForm } from 'type/form/basicFormType'
import {
	jobApplicationFileMutationResponse,
} from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle create job application file
export async function createJobApplicationFileRequest(inputCreate: createJobApplicationFileForm) {
	const resultFetch = await postData<jobApplicationFileMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-application-files`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete job application file
export async function deleteJobApplicationFileRequest(inputDelete: {
	jobApplicationFileId: number
	jobApplicationId: number
}) {
	const resultFetch = await deleteData<jobApplicationFileMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-application-files/${inputDelete.jobApplicationFileId}/job-application/${inputDelete.jobApplicationId}`,
	})

	return resultFetch
}

//Function handle get all job application files
export const allJobApplicationFilesRequest = async (url: string) => {
	return await getData<jobApplicationFileMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
