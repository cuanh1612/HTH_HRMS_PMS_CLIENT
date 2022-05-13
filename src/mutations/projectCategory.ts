import {
	createProjectCategoryRequest,
	deleteProjectCategoryRequest,
	updateProjectCategoryRequest,
} from 'requests/projectCategory'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectCategoryMutation = (setToast: TToast) => {
	return useMutation(createProjectCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteProjectCategoryMutation = (setToast: TToast) => {
	return useMutation(deleteProjectCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateProjectCategoryMutation = (setToast: TToast) => {
	return useMutation(updateProjectCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
