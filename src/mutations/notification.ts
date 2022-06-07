import { deleteNotificationRequest } from 'requests/notification'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

// delete one
export const deleteNotificationMutation = (setToast: TToast) => {
	return useMutation(deleteNotificationRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
