import { createProjectFileRequest, deleteProjectFileRequest } from 'requests/projectFile'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectFileMutation = (setToast: TToast) => {
	return useMutation(createProjectFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//create
export const deleteProjectFileMutation = (setToast: TToast) => {
	return useMutation(deleteProjectFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
