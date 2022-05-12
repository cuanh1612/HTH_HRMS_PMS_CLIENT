import { AxiosError } from 'axios'
import { detailEventRequest } from 'requests/event'
import useSWR from 'swr'
import { eventMutaionResponse } from 'type/mutationResponses'

export const detailEventQuery = (
	isAuthenticated: boolean | null,
	contractId: number | null | undefined
) => {
	return useSWR<eventMutaionResponse, AxiosError>(
		isAuthenticated && contractId ? `events/${contractId}` : null,
		detailEventRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
