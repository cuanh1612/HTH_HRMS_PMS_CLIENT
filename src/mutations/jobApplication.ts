import {
	createJobApplicationRequest,
	deleteJobApplicationRequest,
	deleteManyJobApplicationsRequest,
	updateJobApplicationRequest,
	updateJobApplicationsStatusRequest,
} from 'requests/jobApplication'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createJobApplicationMutation = (setToast: TToast) => {
	return useMutation(createJobApplicationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
//update job's status
export const updateJobApplicationStatusMutation = (setToast: TToast) => {
	return useMutation(updateJobApplicationsStatusRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateJobApplicationMutation = (setToast: TToast) => {
	return useMutation(updateJobApplicationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteJobApplicationMutation = (setToast: TToast) => {
	return useMutation(deleteJobApplicationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteJobApplicationsMutation = (setToast: TToast) => {
	return useMutation(deleteManyJobApplicationsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
