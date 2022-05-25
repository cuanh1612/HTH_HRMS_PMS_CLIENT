import {
	createNoticeBoardForm, updateNoticeBoardForm
} from 'type/form/basicFormType'
import { NoticeBoardMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createNoticeBoardRequest(inputCreate: createNoticeBoardForm) {
	const resultFetch = await postData<NoticeBoardMutaionResponse>({
		url: 'http://localhost:4000/api/notice-boards',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail notice board
export const detailNoticeBoardRequest = async (url: string) => {
	return await getData<NoticeBoardMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

// get all notice board
export const allNoticeBoardRequest = async (url: string) => {
	return await getData<NoticeBoardMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update notice board
export async function updateNoticeBoardtRequest({
	inputUpdate,
	noticeBoardId,
}: {
	inputUpdate: updateNoticeBoardForm
	noticeBoardId: number | string
}) {
	const resultFetch = await putData<NoticeBoardMutaionResponse>({
		url: `http://localhost:4000/api/notice-boards/${noticeBoardId}`,
		body: inputUpdate,
	})

	return resultFetch
}


//Handle to delete notice
export const deleteNoticeRequest = async (id?: string | number) => {
	return await deleteData<NoticeBoardMutaionResponse>({
		url: `http://localhost:4000/api/notice-boards/${id}`,
	})
}


// Handle to delete many notices
export const deleteNoticesRequest = async (ids: number[]) => {
	return await postData<NoticeBoardMutaionResponse>({
		url: `http://localhost:4000/api/notice-boards/delete-many`,
		body: {
			noticeBoards: ids,
		},
	})
}

