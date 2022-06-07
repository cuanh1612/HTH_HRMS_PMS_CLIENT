import {
	createProjectNoteForm,
	updateProjectNoteForm,
} from 'type/form/basicFormType'
import { projectMutaionResponse, ProjectNoteMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createProjectNoteRequest(inputCreate: createProjectNoteForm) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: 'http://localhost:4000/api/project-notes',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail
export const detailProjectNoteRequest = async (url: string) => {
	return await getData<ProjectNoteMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle get all
export const allProjectNotesRequest = async (url: string) => {
	return await getData<ProjectNoteMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update
export async function updateProjectNoteRequest({
	projectNoteId,
	inputCreate,
}: {
	inputCreate: updateProjectNoteForm
	projectNoteId: number | string
}) {
	const resultFetch = await putData<ProjectNoteMutaionResponse>({
		url: `http://localhost:4000/api/project-notes/${projectNoteId}`,
		body: inputCreate,
	})

	return resultFetch
}
