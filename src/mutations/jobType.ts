import { createJobTypeRequest, deleteJobTypeRequest, updateJobTypeRequest } from 'requests/jobType'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createJobTypeMutation = (setToast: TToast) => {
	return useMutation(createJobTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//Update skill
export const updateJobTypeMutation = (setToast: TToast) => {
	return useMutation(updateJobTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete skill
export const deleteJobTypeMutation = (setToast: TToast) => {
	return useMutation(deleteJobTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
