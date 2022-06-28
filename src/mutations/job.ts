import {
	createJobsRequest,
	deleteJobRequest,
	deleteManyJobsRequest,
	updateJoblRequest,
} from 'requests/job'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createJobMutation = (setToast: TToast) => {
	return useMutation(createJobsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateJobMutation = (setToast: TToast) => {
	return useMutation(updateJoblRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteJobMutation = (setToast: TToast) => {
	return useMutation(deleteJobRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteJobsMutation = (setToast: TToast) => {
	return useMutation(deleteManyJobsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
