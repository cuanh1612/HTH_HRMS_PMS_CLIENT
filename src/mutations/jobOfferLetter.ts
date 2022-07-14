import {
	createJobOfferLetterRequest,
	deleteJobOfferRequest,
	deleteManyJobOffersRequest,
	updateJobOfferRequest,
	updateOfferLetterStatusRequest,
} from 'requests/jobOfferLetter'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createJobOfferLetterMutation = (setToast: TToast) => {
	return useMutation(createJobOfferLetterRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateJobOfferLetterMutation = (setToast: TToast) => {
	return useMutation(updateJobOfferRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteJobOfferLetterMutation = (setToast: TToast) => {
	return useMutation(deleteJobOfferRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete many
export const deleteJobOfferLettersMutation = (setToast: TToast) => {
	return useMutation(deleteManyJobOffersRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update job offer letter status
export const updateOfferLetterStatusMutation = (setToast: TToast) => {
	return useMutation(updateOfferLetterStatusRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

