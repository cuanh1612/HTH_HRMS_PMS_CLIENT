import { AxiosError } from 'axios'
import { detailEmployeeRequest } from 'requests/employee'
import useSWR from 'swr'
import { employeeMutaionResponse } from 'type/mutationResponses'

export const detailEmployeeQuery = (isAuthenticated: boolean | null, employeeId: number | null) => {
	return useSWR<employeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
