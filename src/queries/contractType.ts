import { AxiosError } from 'axios'
import { allContractTypesRequest } from 'requests/contractType'
import useSWR from 'swr'
import { contractTypeMutaionResponse } from 'type/mutationResponses'

export const allContractTypesQuery = () => {
	return useSWR<contractTypeMutaionResponse, AxiosError>(
		`contract-types`,
		allContractTypesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
