import { AxiosError } from 'axios'
import { allDepartmentRequest } from 'requests/department'
import useSWR from 'swr'
import { DepartmentMutaionResponse } from 'type/mutationResponses'

export const allDepartmentsQuery = (isAuthenticated: boolean) => {
	return useSWR<DepartmentMutaionResponse, AxiosError>(
		isAuthenticated ? 'departments' : null,
		allDepartmentRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
