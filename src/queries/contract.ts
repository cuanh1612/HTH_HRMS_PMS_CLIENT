import { AxiosError } from 'axios'
import { allContractsRequest, detailContractRequest } from 'requests/contract'
import useSWR from 'swr'
import { contractMutaionResponse } from 'type/mutationResponses'

export const detailContractQuery = (
	isAuthenticated: boolean | null,
	contractId: number | null | undefined
) => {
	return useSWR<contractMutaionResponse, AxiosError>(
		isAuthenticated && contractId ? `contracts/${contractId}` : null,
		detailContractRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allContractsQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<contractMutaionResponse, AxiosError>(
		isAuthenticated ? `contracts` : null,
		allContractsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}



