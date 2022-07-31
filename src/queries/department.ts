import { AxiosError } from 'axios'
import { allDepartmentRequest } from 'requests/department'
import useSWR from 'swr'
import { DepartmentMutationResponse } from 'type/mutationResponses'

export const allDepartmentsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<DepartmentMutationResponse, AxiosError>(
		isAuthenticated ? 'departments' : null,
		allDepartmentRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}