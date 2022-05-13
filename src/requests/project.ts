import { createProjectForm } from 'type/form/basicFormType'
import { projectMutaionResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create
export async function createProjectRequest(inputCreate: createProjectForm) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: 'http://localhost:4000/api/projects',
		body: inputCreate,
	})

	return resultFetch
}
