import { createLeaveRequest, updateLeaveRequest } from 'requests/leave'
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
