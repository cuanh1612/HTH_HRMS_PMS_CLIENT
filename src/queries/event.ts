import { AxiosError } from 'axios'
import { allEventsRequest, detailEventRequest } from 'requests/event'
import useSWR from 'swr'
import { eventMutaionResponse } from 'type/mutationResponses'

export const detailEventQuery = (
	isAuthenticated: boolean | null,
	contractId: string | number | null | undefined
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

export const allEventsQuery = (isAuthenticated: boolean | null, employee?: string, client?: string, name?: string) => {
	const fieldUrl: string[] = []
	employee && fieldUrl.push(`employee=${employee}`)
	client && fieldUrl.push(`client=${client}`)
	name && fieldUrl.push(`name=${name}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<eventMutaionResponse, AxiosError>(
		isAuthenticated ? (url ? `events${url}` : 'events') : null,
		allEventsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}