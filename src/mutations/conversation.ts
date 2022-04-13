import { createConversationRequest } from 'requests/conversation'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createConversationMutation = (setToast: TToast) => {
	return useMutation(createConversationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
