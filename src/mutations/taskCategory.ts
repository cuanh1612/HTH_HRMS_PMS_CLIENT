import {
	createTaskCategoryRequest,
	deleteTaskCategoryRequest,
	updateTaskCategoryRequest,
} from 'requests/taskCategory'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createTaskCategoryMutation = (setToast: TToast) => {
	return useMutation(createTaskCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteTaskCategoryMutation = (setToast: TToast) => {
	return useMutation(deleteTaskCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateTaskCategoryMutation = (setToast: TToast) => {
	return useMutation(updateTaskCategoryRequest , {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
