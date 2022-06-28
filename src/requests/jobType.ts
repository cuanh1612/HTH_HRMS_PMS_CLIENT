import { createJobTypeForm, updateJobTypeForm } from 'type/form/basicFormType'
import { jobTypeMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create job types
export async function createJobTypeRequest(inputCreate: createJobTypeForm) {
	const resultFetch = await postData<jobTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-types`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update job type
export async function updateJobTypeRequest(inputUpdate: updateJobTypeForm) {
	const resultFetch = await putData<jobTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-types/${inputUpdate.jobTypeId}`,
		body: {
			name: inputUpdate.name,
		},
	})

	return resultFetch
}

//Function handle get all or get detail locations
export const getJobTypeRequest = async (url: string) => {
	return await getData<jobTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete job type
export async function deleteJobTypeRequest(jobtypeId: string | number) {
	const resultFetch = await deleteData<jobTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-types/${jobtypeId}`,
	})

	return resultFetch
}
