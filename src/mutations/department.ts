import { createDepartmentRequest, deleteDepartmentRequest, updateDepartmentRequest } from "requests/department"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"

//create
export const createDepartmentMutation = (setToast: TToast) => {
	return useMutation(createDepartmentRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error'
			})
		},
	})
}

//delete
export const deleteDepartmentMutation = (setToast: TToast) => {
	return useMutation(deleteDepartmentRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error'
			})
		},
	})
}

//update
export const updateDepartmentMutation = (setToast: TToast) => {
	return useMutation(updateDepartmentRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error'
			})
		},
	})
}