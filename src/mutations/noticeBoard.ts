import { createNoticeBoardRequest, updateNoticeBoardtRequest } from 'requests/noticeBoard'
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
