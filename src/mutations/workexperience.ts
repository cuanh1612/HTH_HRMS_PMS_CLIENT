import {
	createWorkExperienceRequest,
	deleteWorkExperienceRequest,
	updateWorkExperienceRequest,
} from 'requests/workExperience'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createWorkExperienceMutation = (setToast: TToast) => {
	return useMutation(createWorkExperienceRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//Update
export const updateWorkExperienceMutation = (setToast: TToast) => {
	return useMutation(updateWorkExperienceRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteWorkExperienceMutation = (setToast: TToast) => {
	return useMutation(deleteWorkExperienceRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
