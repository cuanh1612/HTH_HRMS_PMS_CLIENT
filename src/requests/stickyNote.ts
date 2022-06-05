import { createStickyNoteForm, updateStickyNoteForm } from 'type/form/basicFormType'
import { stickyNoteMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createStickyNoteRequest(inputCreate: createStickyNoteForm) {
	const resultFetch = await postData<stickyNoteMutaionResponse>({
		url: 'http://localhost:4000/api/sticky-notes',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get all sticky note
export const allStickyNoteRequest = async (url: string) => {
	return await getData<stickyNoteMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Handle to delete sticky note
export const deleteStickyNoteRequest = async (id: string | number) => {
	return await deleteData<stickyNoteMutaionResponse>({
		url: `http://localhost:4000/api/sticky-notes/${id}`,
	})
}

//Function handle get detail stickyNote
export const detailStickyNoteRequest = async (url: string) => {
	return await getData<stickyNoteMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update stickynote
export async function updateStickyNoteRequest({
	stickyNoteId,
	inputUpdate
}: {
	stickyNoteId: number | string
	inputUpdate: updateStickyNoteForm
}) {
	const resultFetch = await putData<stickyNoteMutaionResponse>({
		url: `http://localhost:4000/api/sticky-notes/${stickyNoteId}`,
		body: inputUpdate,
	})
	return resultFetch
}
