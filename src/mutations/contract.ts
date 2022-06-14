import { createContractRequest, deleteContractRequest, deleteContractsRequest, importCSVContractRequest, publicLinkRequest, updateContractRequest } from 'requests/contract'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createContractMutation = (setToast: TToast) => {
	return useMutation(createContractRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//create
export const importCSVContractsMutation = (setToast: TToast) => {
	return useMutation(importCSVContractRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}


//update
export const updateContractMutation = (setToast: TToast) => {
	return useMutation(updateContractRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteContractMutation = (setToast: TToast) => {
	return useMutation(deleteContractRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteContractsMutation = (setToast: TToast) => {
	return useMutation(deleteContractsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// get public link
export const publicLinkContractMutation = (setToast: TToast) => {
	return useMutation(publicLinkRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}