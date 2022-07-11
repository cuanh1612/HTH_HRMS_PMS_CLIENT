import {
	createinterviewRequest,
	deleteInterviewRequest,
	deleteManyInterviewsRequest,
	updateInterviewlRequest,
	updateInterviewStatusRequest,
} from 'requests/interview'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createInterviewMutation = (setToast: TToast) => {
	return useMutation(createinterviewRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateInterviewMutation = (setToast: TToast) => {
	return useMutation(updateInterviewlRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteInterviewMutation = (setToast: TToast) => {
	return useMutation(deleteInterviewRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteInterviewsMutation = (setToast: TToast) => {
	return useMutation(deleteManyInterviewsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update interview's status
export const updateInterviewStatusMutation = (setToast: TToast) => {
	return useMutation(updateInterviewStatusRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

