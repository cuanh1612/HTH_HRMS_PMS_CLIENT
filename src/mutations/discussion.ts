import { createDiscussionRequest, deleteDiscussionRequest, updateDiscussionRequest } from 'requests/discussion'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createDiscussionMutation = (setToast: TToast) => {
	return useMutation(createDiscussionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteDiscussionMutation = (setToast: TToast) => {
	return useMutation(deleteDiscussionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateDiscussionMutation = (setToast: TToast) => {
	return useMutation(updateDiscussionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
