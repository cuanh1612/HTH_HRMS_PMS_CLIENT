import { createTimeLogRequest, updateTimeLogRequest } from 'requests/timeLog'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createTimeLogMutation = (setToast: TToast) => {
	return useMutation(createTimeLogRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateTimeLogMutation = (setToast: TToast) => {
	return useMutation(updateTimeLogRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

