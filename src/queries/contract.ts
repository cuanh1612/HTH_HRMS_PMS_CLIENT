import { AxiosError } from 'axios'
import { detailContractRequest } from 'requests/contract'
import useSWR from 'swr'
import { contractMutaionResponse } from 'type/mutationResponses'

export const detailContractQuery = (contractId: number | null) => {
	return useSWR<contractMutaionResponse, AxiosError>(
		contractId ? `contracts/${contractId}` : null,
		detailContractRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
