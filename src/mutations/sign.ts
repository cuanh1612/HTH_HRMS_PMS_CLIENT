import { createSignContractRequest, createSignJobOfferLetterRequest } from 'requests/sign'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createSignContractMutation = (setToast: TToast) => {
	return useMutation(createSignContractRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

export const createSignJobOfferLetterMutation = (setToast: TToast) => {
	return useMutation(createSignJobOfferLetterRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
