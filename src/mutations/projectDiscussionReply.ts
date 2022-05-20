import { createProjectDiscussionReplyRequest, updateProjectDiscussionReplyRequest } from 'requests/projectDiscussionReply'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectDiscussionReplyMutation = (setToast: TToast) => {
	return useMutation(createProjectDiscussionReplyRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateProjectDiscussionReplyMutation = (setToast: TToast) => {
	return useMutation(updateProjectDiscussionReplyRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}