import { AxiosError } from 'axios'
import { contractInfoRequest } from 'requests/companyInfo'
import useSWR from 'swr'
import { companyInfoMutationResponse } from 'type/mutationResponses'

export const companyInfoQuery = (isAuthenticated: boolean | null) => {
	return useSWR<companyInfoMutationResponse, AxiosError>(
		isAuthenticated ? `company-info` : null,
		contractInfoRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
} 
