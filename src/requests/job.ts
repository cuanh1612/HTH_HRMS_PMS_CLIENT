import { createJobForm, deleteJobsForm, updateJobForm } from 'type/form/basicFormType'
import { jobMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create jobs
export async function createJobsRequest(inputCreate: createJobForm) {
	const resultFetch = await postData<jobMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update jobs
export async function updateJoblRequest(inputUpdate: updateJobForm) {
	const resultFetch = await putData<jobMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${inputUpdate.jobId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle update job's status
export async function updateJobStatusRequest({id, status}: {id: number | null, status: boolean}) {
	const resultFetch = await putData<jobMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/status/${id}`,
		body: {
			status
		},
	})

	return resultFetch
}

//Function handle get all or detail job
export const getJobRequest = async (url: string) => {
	return await getData<jobMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete jobs
export async function deleteJobRequest(jobId: string | number) {
	const resultFetch = await deleteData<jobMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
	})

	return resultFetch
}

//Function handle delete many jobs
export async function deleteManyJobsRequest(inputDelete: deleteJobsForm) {
	const resultFetch = await postData<jobMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/delete-many`,
		body: inputDelete,
	})

	return resultFetch
}
