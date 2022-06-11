import { AxiosError } from 'axios'
import { allClientsRequest, countProjectStatusRequest, detailClientRequest } from 'requests/client'
import useSWR from 'swr'
import {
	clientMutaionResponse,
	clientProjectStatusMutaionResponse,
	clientTotalEarningMutaionResponse,
	clientTotalProjectsMutaionResponse
} from 'type/mutationResponses'

export const detailClientQuery = (
	isAuthenticated: boolean | null,
	clientId: string | number | null
) => {
	return useSWR<clientMutaionResponse, AxiosError>(
		isAuthenticated && clientId ? `clients/${clientId}` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const clientTotalProejctsQuery = (
	isAuthenticated: boolean | null,
	clientId: string | number | null
) => {
	return useSWR<clientTotalProjectsMutaionResponse, AxiosError>(
		isAuthenticated && clientId ? `clients/${clientId}/total-projects` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const clientTotalEarningQuery = (
	isAuthenticated: boolean | null,
	clientId: string | number | null
) => {
	return useSWR<clientTotalEarningMutaionResponse, AxiosError>(
		isAuthenticated && clientId ? `clients/${clientId}/total-earnings` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const clientCountProjectStatusQuery = (
	isAuthenticated: boolean | null,
	clientId: string | number | null
) => {
	return useSWR<clientProjectStatusMutaionResponse, AxiosError>(
		isAuthenticated && clientId ? `projects/client/${clientId}/project-status` : null,
		countProjectStatusRequest,
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
