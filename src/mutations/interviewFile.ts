import { createInterviewFileRequest, deleteInterviewFileRequest } from 'requests/interviewFile'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createInterviewFileMutation = (setToast: TToast) => {
	return useMutation(createInterviewFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteInterviewFileMutation = (setToast: TToast) => {
	return useMutation(deleteInterviewFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
