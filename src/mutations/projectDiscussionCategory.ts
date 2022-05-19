import { createProjecrtDiscussionCategoryRequest, deleteProjecrtDiscussionCategoryRequest, updateProjectDiscussionCategoryRequest } from 'requests/projectDiscussionCategory'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectDiscussionCategoryMutation = (setToast: TToast) => {
	return useMutation(createProjecrtDiscussionCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteProjectDiscussionCategoryMutation = (setToast: TToast) => {
	return useMutation(deleteProjecrtDiscussionCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateProjectDiscussionCategoryMutation = (setToast: TToast) => {
	return useMutation(updateProjectDiscussionCategoryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
