import {
	createSubCategoryRequest,
	deleteSubCategoryRequest,
	updateSubCategoryRequest,
} from 'requests/clientSubCategory'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createSubCategoryMutation = (setToast: TToast) => {
	return useMutation(createSubCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteSubCategoryMutation = (setToast: TToast) => {
	return useMutation(deleteSubCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateSubCategoryMutation = (setToast: TToast) => {
	return useMutation(updateSubCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
