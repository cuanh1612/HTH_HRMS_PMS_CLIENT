import { AxiosError } from 'axios'
import { allDepartmentRequest } from 'requests/department'
import useSWR from 'swr'
import { DesignationMutaionResponse } from 'type/mutationResponses'

export const allDesignationsQuery = (isAuthenticated: boolean) => {
	return useSWR<DesignationMutaionResponse, AxiosError>(
		isAuthenticated ? 'designations' : null,
		allDepartmentRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
