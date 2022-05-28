import { AxiosError } from 'axios'
import { allClientsRequest, detailClientRequest } from 'requests/client'
import useSWR from 'swr'
import { clientMutaionResponse } from 'type/mutationResponses'

export const detailClientQuery = (isAuthenticated: boolean | null, clientId: number | null) => {
	return useSWR<clientMutaionResponse, AxiosError>(
		isAuthenticated && clientId ? `clients/${clientId}` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allClientsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<clientMutaionResponse, AxiosError>(
		isAuthenticated ? `clients` : null,
		allClientsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allClientsNormalQuery = (isAuthenticated: boolean | null) => {
	return useSWR<clientMutaionResponse, AxiosError>(
		isAuthenticated ? `clients/normal` : null,
		allClientsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
