import { createHolidaysRequest, updateHolidayRequest } from 'requests/holiday'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createHolidaysMutation = (setToast: TToast) => {
	return useMutation(createHolidaysRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateHolidayMutation = (setToast: TToast) => {
	return useMutation(updateHolidayRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}