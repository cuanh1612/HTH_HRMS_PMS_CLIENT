import { createProjectNoteRequest, deleteProjectNoteRequest, deleteProjectsNoteRequest, updateProjectNoteRequest } from 'requests/projectNote'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectNoteMutation = (setToast: TToast) => {
	return useMutation(createProjectNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//Update salary
export const updateProjectNoteMutation = (setToast: TToast) => {
	return useMutation(updateProjectNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteProjectNoteMutation = (setToast: TToast) => {
	return useMutation(deleteProjectNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteProjectNotesMutation = (setToast: TToast) => {
	return useMutation(deleteProjectsNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}



