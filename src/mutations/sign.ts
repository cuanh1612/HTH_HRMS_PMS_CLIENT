import { createSignRequest } from 'requests/sign'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createSignMutation = (setToast: TToast) => {
	return useMutation(createSignRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
