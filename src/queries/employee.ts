import { AxiosError } from 'axios'
import { allEmployeesRequest, detailEmployeeRequest } from 'requests/employee'
import useSWR from 'swr'
import { countLeavesTakenEmployeeMutaionResponse, countProjectsEmployeeMutaionResponse, employeeMutaionResponse, hoursLoggedEmployeeMutaionResponse, lateAttendanceEmployeeMutaionResponse, openTasksEmployeeMutaionResponse } from 'type/mutationResponses'

export const detailEmployeeQuery = (isAuthenticated: boolean | null, employeeId: string | number | null) => {
	return useSWR<employeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const openTasksEmployeeQuery = (isAuthenticated: boolean | null, employeeId: string | number | null) => {
	return useSWR<openTasksEmployeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/open-tasks` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const hoursLoggedEmployeeQuery = (isAuthenticated: boolean | null, employeeId: string | number | null) => {
	return useSWR<hoursLoggedEmployeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/hours-logged` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countProjectsEmployeeQuery = (isAuthenticated: boolean | null, employeeId: string | number | null) => {
	return useSWR<countProjectsEmployeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-projects` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const lateAttendanceEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<lateAttendanceEmployeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/late-attendance` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const leavesTakenEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countLeavesTakenEmployeeMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-leaves-taken` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allEmployeesNormalQuery = (isAuthenticated: boolean | null) => {
	return useSWR<employeeMutaionResponse, AxiosError>(
		isAuthenticated ? `employees/normal` : null,
		allEmployeesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}


