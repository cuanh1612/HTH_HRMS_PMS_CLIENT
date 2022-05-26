import { createTimeLogRequest } from 'requests/timeLog'
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
