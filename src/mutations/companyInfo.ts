import { updateCompanyInfoRequest } from 'requests/companyInfo'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//update
export const updateCompanyInfoMutation = (setToast: TToast) => {
	return useMutation(updateCompanyInfoRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}
