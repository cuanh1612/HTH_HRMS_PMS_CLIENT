import {
	createJobApplicationFileRequest,
	deleteJobApplicationFileRequest,
} from 'requests/jobApplicationFile'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createJobApplicationFileMutation = (setToast: TToast) => {
	return useMutation(createJobApplicationFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteJobApplicationFileMutation = (setToast: TToast) => {
	return useMutation(deleteJobApplicationFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
