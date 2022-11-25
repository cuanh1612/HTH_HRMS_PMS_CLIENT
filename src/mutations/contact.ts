import { sendMailContactRequest } from 'requests/contact'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const SendMailContactMutation = (setToast: TToast) => {
	return useMutation(sendMailContactRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}