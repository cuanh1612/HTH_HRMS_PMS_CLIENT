import {
	changeSkillsJobApplicationForm,
	createJobApplicationForm,
	deleteJobApplicationsForm,
	updateJobApplicationForm,
} from 'type/form/basicFormType'
import { jobApplicationMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create job application
export async function createJobApplicationRequest(inputCreate: createJobApplicationForm) {
	const resultFetch = await postData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-applications`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update job's status
export async function updateJobApplicationsStatusRequest({id, status}: {id: number | null, status: string}) {
	const resultFetch = await putData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/status/${id}`,
		body: {
			status
		},
	})

	return resultFetch
}


//Function handle update job appliication
export async function updateJobApplicationRequest(inputUpdate: updateJobApplicationForm) {
	const resultFetch = await putData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/${inputUpdate.jobApplicationId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all or detail job application
export const getJobApplicationRequest = async (url: string) => {
	return await getData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete jobs
export async function deleteJobApplicationRequest(jobApplicationId: string | number) {
	const resultFetch = await deleteData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/${jobApplicationId}`,
	})

	return resultFetch
}

//Function handle delete many job applications
export async function deleteManyJobApplicationsRequest(inputDelete: deleteJobApplicationsForm) {
	const resultFetch = await postData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/delete-many`,
		body: inputDelete,
	})

	return resultFetch
}

//Function handle change skills job appliication
export async function changeSkillsJobApplicationRequest(inputUpdate: changeSkillsJobApplicationForm) {
	const resultFetch = await postData<jobApplicationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/change-skills`,
		body: inputUpdate,
	})

	return resultFetch
}