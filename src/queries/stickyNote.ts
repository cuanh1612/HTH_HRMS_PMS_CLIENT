import { AxiosError } from 'axios'
import { allStickyNoteRequest, detailStickyNoteRequest } from 'requests/stickyNote'
import useSWR from 'swr'
import { stickyNoteMutaionResponse } from 'type/mutationResponses'

export const allStickyNoteQuery = (isAuthenticated: boolean | null) => {
	return useSWR<stickyNoteMutaionResponse, AxiosError>(
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
	return useSWR<stickyNoteMutaionResponse, AxiosError>(
		isAuthenticated && stickyNoteId ? `sticky-notes/${stickyNoteId}` : null,
		detailStickyNoteRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}


