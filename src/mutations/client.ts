import { createClientRequest, updateClientRequest } from 'requests/client'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createClientMutation = (setToast: TToast) => {
	return useMutation(createClientRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateClientMutation = (setToast: TToast) => {
	return useMutation(updateClientRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
