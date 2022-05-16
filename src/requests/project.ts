import { createProjectForm, updateProjectForm } from 'type/form/basicFormType'
import { projectMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createProjectRequest(inputCreate: createProjectForm) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: 'http://localhost:4000/api/projects',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail project
export const detailProjectRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update project
export async function updateProjectRequest({
	inputUpdate,
	projectId,
}: {
	inputUpdate: updateProjectForm
	projectId: number
}) {
	const resultFetch = await putData<projectMutaionResponse>({
		url: `http://localhost:4000/api/projects/${projectId}`,
		body: inputUpdate,
	})

	return resultFetch
}

// get all
export const allProjectsRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
