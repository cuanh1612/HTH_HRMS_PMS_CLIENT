import { createProjectRequest } from 'requests/project'
import { deleteSalaryRequest, updateSalaryRequest } from 'requests/salary'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//delete
export const deleteSalaryMutation = (setToast: TToast) => {
	return useMutation(deleteSalaryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//Update salary
export const updateSalaryMutation = (setToast: TToast) => {
	return useMutation(updateSalaryRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}