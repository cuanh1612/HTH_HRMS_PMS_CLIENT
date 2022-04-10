import { createLeaveRequest, deleteLeaveRequest, deleteLeavesRequest, updateLeaveRequest, updateStatusRequest } from 'requests/leave'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createLeaveMutation = (setToast: TToast) => {
	return useMutation(createLeaveRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateLeaveMutation = (setToast: TToast) => {
	return useMutation(updateLeaveRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update status
export const updateStatusMutation = (setToast: TToast) => {
	return useMutation(updateStatusRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteLeaveMutation = (setToast: TToast) => {
	return useMutation(deleteLeaveRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}


// delete many
export const deleteLeavesMutation = (setToast: TToast) => {
	return useMutation(deleteLeavesRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}


