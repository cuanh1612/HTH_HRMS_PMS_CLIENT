import { createProjectDiscussionRoomRequest } from 'requests/projectDiscussionRoom'
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
