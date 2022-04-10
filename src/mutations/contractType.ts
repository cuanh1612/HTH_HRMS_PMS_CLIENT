import {
	createContractTypeRequest,
	deleteContractTypeRequest,
	updateContractTypeRequest,
} from 'requests/contractType'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createContractTypeMutation = (setToast: TToast) => {
	return useMutation(createContractTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteContractTypeMutation = (setToast: TToast) => {
	return useMutation(deleteContractTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateContractTypeMutation = (setToast: TToast) => {
	return useMutation(updateContractTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
