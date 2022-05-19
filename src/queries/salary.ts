import { AxiosError } from 'axios'
import { allSalariesRequest, historySalaryRequest } from 'requests/salary'
import useSWR from 'swr'
import { SalaryMutaionResponse } from 'type/mutationResponses'

export const allSalariesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<SalaryMutaionResponse, AxiosError>(
		isAuthenticated ? 'salaries' : null,
		allSalariesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const historySalaryQuery = (isAuthenticated: boolean | null, employeeId: number | string | null) => {
	return useSWR<SalaryMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `salaries/employee/${employeeId}` : null,
		historySalaryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
