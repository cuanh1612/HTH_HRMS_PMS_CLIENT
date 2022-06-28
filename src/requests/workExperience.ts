import { createWorkExperienceForm, updateWorkExperienceForm } from 'type/form/basicFormType'
import { workExperienceMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create job types
export async function createWorkExperienceRequest(inputCreate: createWorkExperienceForm) {
	const resultFetch = await postData<workExperienceMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/work-experiences`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update job type
export async function updateWorkExperienceRequest(inputUpdate: updateWorkExperienceForm) {
	const resultFetch = await putData<workExperienceMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/work-experiences/${inputUpdate.workExperienceId}`,
		body: {
			name: inputUpdate.name,
		},
	})

	return resultFetch
}

//Function handle get all or get detail locations
export const getWorkExperienceRequest = async (url: string) => {
	return await getData<workExperienceMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete job type
export async function deleteWorkExperienceRequest(workExperience: string | number) {
	const resultFetch = await deleteData<workExperienceMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/work-experiences/${workExperience}`,
	})

	return resultFetch
}
