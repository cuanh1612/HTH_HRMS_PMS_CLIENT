import { AxiosError } from 'axios'
import { allClientsRequest, countProjectStatusRequest, detailClientRequest } from 'requests/client'
import useSWR from 'swr'
import {
	clientMutationResponse,
	clientProjectStatusMutationResponse,
	clientTotalEarningMutationResponse,
	clientTotalProjectsMutationResponse,
	countContractSignedClientMutationResponse,
	pendingMilestoneClientMutationResponse,
} from 'type/mutationResponses'

export const detailClientQuery = (
	isAuthenticated: boolean | null,
	clientId: string | number | null
) => {
	return useSWR<clientMutationResponse, AxiosError>(
		isAuthenticated && clientId ? `clients/${clientId}` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const clientTotalProjectsQuery = (
	isAuthenticated: boolean | null,
	clientId?: string | number | null
) => {
	return useSWR<clientTotalProjectsMutationResponse, AxiosError>(
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
	return useSWR<clientTotalEarningMutationResponse, AxiosError>(
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
	clientId?: string | number | null
) => {
	return useSWR<clientProjectStatusMutationResponse, AxiosError>(
		isAuthenticated && clientId ? `projects/client/${clientId}/project-status` : null,
		countProjectStatusRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allClientsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<clientMutationResponse, AxiosError>(
		isAuthenticated ? `clients` : null,
		allClientsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allClientsNormalQuery = (isAuthenticated: boolean | null) => {
	return useSWR<clientMutationResponse, AxiosError>(
		isAuthenticated ? `clients/normal` : null,
		allClientsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countContractSignedQuery = (
	isAuthenticated: boolean | null,
	clientId?: string | number | null
) => {
	return useSWR<countContractSignedClientMutationResponse, AxiosError>(
		isAuthenticated && clientId ? `contracts/client/${clientId}/count-contracts-signed` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const pendingMilestoneClientQuery = (
	isAuthenticated: boolean | null,
	clientId?: string | number | null
) => {
	return useSWR<pendingMilestoneClientMutationResponse, AxiosError>(
		isAuthenticated && clientId ? `clients/${clientId}/pending-milestone` : null,
		detailClientRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
