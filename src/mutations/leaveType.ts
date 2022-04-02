import { createLeaveTypeRequest } from 'requests/leaveType'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createLeaveTypeMutation = (setToast: TToast) => {
	return useMutation(createLeaveTypeRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
