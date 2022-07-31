import { AxiosError } from 'axios'
import { allStickyNoteRequest, detailStickyNoteRequest } from 'requests/stickyNote'
import useSWR from 'swr'
import { stickyNoteMutationResponse } from 'type/mutationResponses'

export const allStickyNoteQuery = (isAuthenticated: boolean | null) => {
	return useSWR<stickyNoteMutationResponse, AxiosError>(
		isAuthenticated ? `sticky-notes` : null,
		allStickyNoteRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailStickyNoteQuery = (
	isAuthenticated: boolean | null,
	stickyNoteId: string | number | null | undefined
) => {
	return useSWR<stickyNoteMutationResponse, AxiosError>(
		isAuthenticated && stickyNoteId ? `sticky-notes/${stickyNoteId}` : null,
		detailStickyNoteRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}


