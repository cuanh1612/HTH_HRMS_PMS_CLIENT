import { createTimeLogRequest, deleteTimeLogRequest, deleteTimeLogsRequest, updateTimeLogRequest } from 'requests/timeLog'
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


// delete one
export const deleteTimeLogMutation = (setToast: TToast) => {
	return useMutation(deleteTimeLogRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteTimeLogsMutation = (setToast: TToast) => {
	return useMutation(deleteTimeLogsRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}


