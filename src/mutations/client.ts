import { createClientRequest, deleteClientRequest, deleteClientsRequest, importCSVClientRequest, updateClientRequest } from 'requests/client'
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

//create
export const importCSVClientMutation = (setToast: TToast) => {
	return useMutation(importCSVClientRequest, {
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

// delete one
export const deleteClientMutation = (setToast: TToast) => {
	return useMutation(deleteClientRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteClientsMutation = (setToast: TToast) => {
	return useMutation(deleteClientsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

