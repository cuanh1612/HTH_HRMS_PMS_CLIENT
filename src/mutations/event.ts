import { createEventRequest } from 'requests/event'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createEventMutation = (setToast: TToast) => {
	return useMutation(createEventRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
