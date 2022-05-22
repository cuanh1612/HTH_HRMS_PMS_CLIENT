import { changePositionRequest, createStatusColumnRequest, deleteStatusColumnRequest, updateStatusRequest } from "requests/status"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"

//update position of column
export const changePositionMutation = (setToast: TToast) => {
	return useMutation(changePositionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//create
export const createStatusColumnMutation = (setToast: TToast) => {
	return useMutation(createStatusColumnRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteStatusColumnMutation = (setToast: TToast) => {
	return useMutation(deleteStatusColumnRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateStatusColumnMutation = (setToast: TToast) => {
	return useMutation(updateStatusRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
