import {
	createLocationRequest,
	deleteLocationRequest,
	updateLocationRequest,
} from 'requests/location'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createLocationsMutation = (setToast: TToast) => {
	return useMutation(createLocationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//Update skill
export const updateLocationsMutation = (setToast: TToast) => {
	return useMutation(updateLocationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete skill
export const deleteLocationsMutation = (setToast: TToast) => {
	return useMutation(deleteLocationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
