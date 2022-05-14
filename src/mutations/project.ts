import { createProjectRequest, updateProjectRequest } from 'requests/project'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectMutation = (setToast: TToast) => {
	return useMutation(createProjectRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateProjectMutation = (setToast: TToast) => {
	return useMutation(updateProjectRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
