import {
	createSkillsRequest,
	deleteManySkillsRequest,
	deleteSkillRequest,
	updateSkillRequest,
} from 'requests/skill'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createSkillsMutation = (setToast: TToast) => {
	return useMutation(createSkillsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//Update skill
export const updateSkillMutation = (setToast: TToast) => {
	return useMutation(updateSkillRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete skill
export const deleteSkillMutation = (setToast: TToast) => {
	return useMutation(deleteSkillRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete skill
export const deleteManySkillMutation = (setToast: TToast) => {
	return useMutation(deleteManySkillsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
