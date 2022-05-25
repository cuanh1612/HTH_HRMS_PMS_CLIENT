import { createNoticeBoardRequest, deleteNoticeRequest, deleteNoticesRequest, updateNoticeBoardtRequest } from 'requests/noticeBoard'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createNoticeBoardMutation = (setToast: TToast) => {
	return useMutation(createNoticeBoardRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateNoticeBoardMutation = (setToast: TToast) => {
	return useMutation(updateNoticeBoardtRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteNoticeMutation = (setToast: TToast) => {
	return useMutation(deleteNoticeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteNoticesMutation = (setToast: TToast) => {
	return useMutation(deleteNoticesRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}