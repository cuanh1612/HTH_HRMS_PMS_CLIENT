import {
	createProjectDiscussionRoomRequest,
	deleteProjectDiscussionRoomRequest,
} from 'requests/projectDiscussionRoom'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createProjectDiscussionRoomMutation = (setToast: TToast) => {
	return useMutation(createProjectDiscussionRoomRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//delete
export const deleteProjectDiscussionRoomMutation = (setToast: TToast) => {
	return useMutation(deleteProjectDiscussionRoomRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
