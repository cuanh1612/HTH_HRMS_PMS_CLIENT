import { createEmployeeRequest, updateEmployeeRequest } from "requests/employee"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"

//create
export const createEmployeeMutation = (setToast: TToast) => {
	return useMutation(createEmployeeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error'
			})
		},
	})
}

//update
export const updateEmployeeMutation = (setToast: TToast) => {
	return useMutation(updateEmployeeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error'
			})
		},
	})
}