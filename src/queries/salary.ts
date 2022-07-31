import { AxiosError } from 'axios'
import { allSalariesRequest, historySalaryRequest } from 'requests/salary'
import useSWR from 'swr'
import { SalaryMutationResponse } from 'type/mutationResponses'

export const allSalariesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<SalaryMutationResponse, AxiosError>(
		isAuthenticated ? 'salaries' : null,
		allSalariesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const historySalaryQuery = (isAuthenticated: boolean | null, employeeId: number | string | null) => {
	return useSWR<SalaryMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `salaries/employee/${employeeId}` : null,
		historySalaryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
