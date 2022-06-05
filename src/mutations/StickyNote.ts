import { changePositionRequest } from 'requests/status'
import { createStickyNoteRequest, deleteStickyNoteRequest, updateStickyNoteRequest } from 'requests/stickyNote'
import { TToast } from 'type/basicTypes'
import useMutation from 'use-mutation'

//create
export const createStickyNoteMutation = (setToast: TToast) => {
	return useMutation(createStickyNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update
export const updateStickyNoteMutation = (setToast: TToast) => {
	return useMutation(updateStickyNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

// delete one
export const deleteStickyNoteMutation = (setToast: TToast) => {
	return useMutation(deleteStickyNoteRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}