import {
	createCategoryRequest,
	deleteCategoryRequest,
	updateCategoryRequest,
} from 'requests/clientCategory'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createCategoryMutation = (setToast: TToast) => {
	return useMutation(createCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteCategoryMutation = (setToast: TToast) => {
	return useMutation(deleteCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateCategoryMutation = (setToast: TToast) => {
	return useMutation(updateCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
