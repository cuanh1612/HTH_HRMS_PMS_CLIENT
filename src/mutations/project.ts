import { createProjectRequest, deleteProjectRequest, deleteProjectsRequest, updateProjectRequest } from 'requests/project'
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

// delete one
export const deleteProjectMutation = (setToast: TToast) => {
	return useMutation(deleteProjectRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteProjectsMutation = (setToast: TToast) => {
	return useMutation(deleteProjectsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
