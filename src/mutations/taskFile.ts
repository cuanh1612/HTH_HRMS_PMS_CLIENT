import { createTaskFileRequest, deleteTaskFileRequest } from 'requests/taskFile'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createTaskFileMutation = (setToast: TToast) => {
	return useMutation(createTaskFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteTaskFileMutation = (setToast: TToast) => {
	return useMutation(deleteTaskFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
