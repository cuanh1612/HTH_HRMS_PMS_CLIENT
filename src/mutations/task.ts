import {
	changePositionRequest,
	createTaskRequest,
	deleteTaskRequest,
	deleteTasksRequest,
	updateTaskRequest,
} from 'requests/task'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

// delete one
export const deleteTaskMutation = (setToast: TToast) => {
	return useMutation(deleteTaskRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update position of task
export const changePositionTaskMutation = (setToast: TToast) => {
	return useMutation(changePositionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//create
export const createTaskMutation = (setToast: TToast) => {
	return useMutation(createTaskRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateTaskMutation = (setToast: TToast) => {
	return useMutation(updateTaskRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteTasksMutation = (setToast: TToast) => {
	return useMutation(deleteTasksRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
