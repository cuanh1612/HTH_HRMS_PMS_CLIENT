import { createStickyNoteForm, updateStickyNoteForm } from 'type/form/basicFormType'
import { stickyNoteMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createStickyNoteRequest(inputCreate: createStickyNoteForm) {
	const resultFetch = await postData<stickyNoteMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/sticky-notes`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get all sticky note
export const allStickyNoteRequest = async (url: string) => {
	return await getData<stickyNoteMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Handle to delete sticky note
export const deleteStickyNoteRequest = async (id: string | number) => {
	return await deleteData<stickyNoteMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/sticky-notes/${id}`,
	})
}

//Function handle get detail stickyNote
export const detailStickyNoteRequest = async (url: string) => {
	return await getData<stickyNoteMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/sticky-notes/${stickyNoteId}`,
		body: inputUpdate,
	})
	return resultFetch
}
