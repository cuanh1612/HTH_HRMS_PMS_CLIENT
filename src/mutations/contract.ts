import { createContractRequest, updateContractRequest } from 'requests/contract'
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
