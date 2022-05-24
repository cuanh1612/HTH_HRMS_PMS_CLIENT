import {
	createTaskCommentRequest,
	deleteTaskCommentRequest,
	updateTaskCommentRequest,
} from 'requests/taskComment'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createTaskCommentMutation = (setToast: TToast) => {
	return useMutation(createTaskCommentRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteTaskCommentMutation = (setToast: TToast) => {
	return useMutation(deleteTaskCommentRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateTaskCommentMutation = (setToast: TToast) => {
	return useMutation(updateTaskCommentRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
