import {
	createNoticeBoardForm, updateNoticeBoardForm
} from 'type/form/basicFormType'
import { NoticeBoardMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createNoticeBoardRequest(inputCreate: createNoticeBoardForm) {
	const resultFetch = await postData<NoticeBoardMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/notice-boards`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail notice board
export const detailNoticeBoardRequest = async (url: string) => {
	return await getData<NoticeBoardMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all notice board
export const allNoticeBoardRequest = async (url: string) => {
	return await getData<NoticeBoardMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
	const resultFetch = await putData<NoticeBoardMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/notice-boards/${noticeBoardId}`,
		body: inputUpdate,
	})

	return resultFetch
}


//Handle to delete notice
export const deleteNoticeRequest = async (id?: string | number) => {
	return await deleteData<NoticeBoardMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/notice-boards/${id}`,
	})
}


// Handle to delete many notices
export const deleteNoticesRequest = async (ids: number[]) => {
	return await postData<NoticeBoardMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/notice-boards/delete-many`,
		body: {
			noticeBoards: ids,
		},
	})
}

