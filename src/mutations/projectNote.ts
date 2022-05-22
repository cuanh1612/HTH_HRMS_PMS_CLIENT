import { createProjectNoteRequest } from 'requests/projectNote'
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
