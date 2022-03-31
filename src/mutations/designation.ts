import {
    createDesignationRequest,
    deleteDesignationRequest,
    updateDesignationRequest
} from 'requests/designation'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createDesignationMutation = (setToast: TToast) => {
	return useMutation(createDesignationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteDesignationMutation = (setToast: TToast) => {
	return useMutation(deleteDesignationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateDesignationMutation = (setToast: TToast) => {
	return useMutation(updateDesignationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
