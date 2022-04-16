import { createConversationReplyRequest } from 'requests/conversationReply'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createConversationReplyMutation = (setToast: TToast) => {
	return useMutation(createConversationReplyRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

