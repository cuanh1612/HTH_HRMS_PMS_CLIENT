import {
	createProjectNoteForm,
	updateProjectNoteForm,
} from 'type/form/basicFormType'
import { projectMutationResponse, ProjectNoteMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createProjectNoteRequest(inputCreate: createProjectNoteForm) {
	const resultFetch = await postData<projectMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-notes`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail
export const detailProjectNoteRequest = async (url: string) => {
	return await getData<ProjectNoteMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle get all
export const allProjectNotesRequest = async (url: string) => {
	return await getData<ProjectNoteMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
	const resultFetch = await putData<ProjectNoteMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-notes/${projectNoteId}`,
		body: inputCreate,
	})

	return resultFetch
}

// Handle to delete many 
export const deleteProjectsNoteRequest = async (ids: number[]) => {
	return await postData<projectMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-notes/delete-many`,
		body: {
			projectNotes: ids,
		},
	})
}

//Handle to delete 
export const deleteProjectNoteRequest = async (id: string | number) => {
	return await deleteData<projectMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-notes/${id}`,
	})
}