import { createClientRequest } from 'requests/client'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createClientMutation = (setToast: TToast) => {
	return useMutation(createClientRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
