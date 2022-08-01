import { AxiosError } from 'axios'
import { allContractTypesRequest } from 'requests/contractType'
import useSWR from 'swr'
import { contractTypeMutationResponse } from 'type/mutationResponses'

export const allContractTypesQuery = () => {
	return useSWR<contractTypeMutationResponse, AxiosError>(
		`contract-types`,
		allContractTypesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
