import { AxiosError } from 'axios'
import { contractInfoRequest } from 'requests/companyInfo'
import useSWR from 'swr'
import { companyInfoMutationResponse } from 'type/mutationResponses'

export const companyInfoQuery = () => {
	return useSWR<companyInfoMutationResponse, AxiosError>(
		`company-info`,
		contractInfoRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
} 
