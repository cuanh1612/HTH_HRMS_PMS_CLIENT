import { AxiosError } from 'axios'
import { allEmployeesRequest, detailEmployeeRequest } from 'requests/employee'
import useSWR from 'swr'
import { countLeavesTakenEmployeeMutationResponse, countPCompleteTasksMutationResponse, countPendingTasksMutationResponse, countProjectsEmployeeMutationResponse, countStatusProjectsMutationResponse, employeeMutationResponse, hoursLoggedEmployeeMutationResponse, lateAttendanceEmployeeMutationResponse, openTasksEmployeeMutationResponse } from 'type/mutationResponses'

export const detailEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number | null) => {
	return useSWR<employeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const openTasksEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<openTasksEmployeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/open-tasks` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const hoursLoggedEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<hoursLoggedEmployeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/hours-logged` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countProjectsEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countProjectsEmployeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-projects` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const lateAttendanceEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<lateAttendanceEmployeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/late-attendance` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const leavesTakenEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countLeavesTakenEmployeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-leaves-taken` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countTasksStatusEmployeeQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countProjectsEmployeeMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-tasks-status` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allEmployeesNormalQuery = (isAuthenticated: boolean | null) => {
	return useSWR<employeeMutationResponse, AxiosError>(
		isAuthenticated ? `employees/normal` : null,
		allEmployeesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allEmployeesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<employeeMutationResponse, AxiosError>(
		isAuthenticated ? `employees` : null,
		allEmployeesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countPendingTasksQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countPendingTasksMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-pending-tasks` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countCompleteTasksQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countPCompleteTasksMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-complete-tasks` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countStatusProjectsQuery = (isAuthenticated: boolean | null, employeeId?: string | number) => {
	return useSWR<countStatusProjectsMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `employees/${employeeId}/count-status-projects` : null,
		detailEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}