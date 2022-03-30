import { createEmployeeRequest } from "requests/employee"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"

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