import { AxiosError } from 'axios'
import { allEventsRequest, detailEventRequest } from 'requests/event'
import useSWR from 'swr'
import { eventMutaionResponse } from 'type/mutationResponses'

export const detailEventQuery = (
	isAuthenticated: boolean | null,
	eventId: string | number | null | undefined
) => {
	return useSWR<eventMutaionResponse, AxiosError>(
		isAuthenticated && eventId ? `events/${eventId}` : null,
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

export const eventsByEmployeeQuery = (
	isAuthenticated: boolean | null,
	employeeId?: string | number 
) => {
	return useSWR<eventMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `events/employee/${employeeId}` : null,
		allEventsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}