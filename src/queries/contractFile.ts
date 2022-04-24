import { AxiosError } from 'axios'
import { allContractFilesRequest } from 'requests/contractFile'
import useSWR from 'swr'
import { contractFileMutaionResponse } from 'type/mutationResponses'

export const allContractFilesQuery = (
	isAuthenticated: boolean | null,
	contractId: number | null
) => {
	return useSWR<contractFileMutaionResponse, AxiosError>(
		isAuthenticated && contractId ? `contract-files/contract/${contractId}` : null,
		allContractFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
