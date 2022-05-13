import { createProjectRequest } from 'requests/project'
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
