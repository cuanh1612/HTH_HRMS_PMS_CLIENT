import { createMilestoneRequest, deleteMilestoneRequest, updateMilestoneRequest } from "requests/milestone"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"


//create
export const createMilestoneTypeMutation = (setToast: TToast) => {
	return useMutation(createMilestoneRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteMilestoneMutation = (setToast: TToast) => {
	return useMutation(deleteMilestoneRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateMilestoneMutation = (setToast: TToast) => {
	return useMutation(updateMilestoneRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}


