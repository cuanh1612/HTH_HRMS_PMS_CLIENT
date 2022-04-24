import { createContractFileRequest, deleteContractFileRequest } from 'requests/contractFile'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createContractFileMutation = (setToast: TToast) => {
	return useMutation(createContractFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//create
export const deleteContractFileMutation = (setToast: TToast) => {
	return useMutation(deleteContractFileRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
