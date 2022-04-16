import { createDiscussionRequest } from 'requests/discussion'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createDiscussionMutation = (setToast: TToast) => {
	return useMutation(createDiscussionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
