import { AxiosError } from 'axios'
import { allDesignationRequest } from 'requests/designation'
import useSWR from 'swr'
import { DesignationMutaionResponse } from 'type/mutationResponses'

export const allDesignationsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<DesignationMutaionResponse, AxiosError>(
		isAuthenticated ? 'designations' : null,
		allDesignationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
