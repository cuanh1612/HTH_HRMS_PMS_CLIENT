import { updatehourlyRateRequest } from "requests/hourlyRate"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"


//update
export const updateHourlyRateMutation = (setToast: TToast) => {
	return useMutation(updatehourlyRateRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
