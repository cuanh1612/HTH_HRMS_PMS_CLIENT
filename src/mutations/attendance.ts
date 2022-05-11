import { createAttendanceRequest } from "requests/attendance"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"

//create
export const createAttendanceMutation = (setToast: TToast) => {
	return useMutation(createAttendanceRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}