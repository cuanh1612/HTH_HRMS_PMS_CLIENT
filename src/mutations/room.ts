import { createRoomRequest, updateRoomRequest } from 'requests/room'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createRoomMutation = (setToast: TToast) => {
	return useMutation(createRoomRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateRoomMutation = (setToast: TToast) => {
	return useMutation(updateRoomRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

