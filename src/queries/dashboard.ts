import { AxiosError } from "axios"
import { getDataDashBoardRequest } from "requests/dashboard"
import useSWR from "swr"

export const pendingTasksQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/pending-tasks`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalClientsQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/total-clients`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalEmployeesQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/total-employees`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalProjectsQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/total-projects`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const todayAttendanceQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/today-attendance`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const pendingTasksRawQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/pending-tasks-raw`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const pendingLeavesRawQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/pending-leaves-raw`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const hoursLoggedQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/hours-logged`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const statusWiseProjects = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/status-wise-projects`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const contractsGeneratedQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/contracts-generated`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const pendingMilestoneQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/pending-milestone`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const contractsSignedQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/contracts-signed`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const clientWiseEarningsQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/client-wise-earnings`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const clientWiseTimeLogsQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/client-wise-time-logs`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const lastestClientsQuery = (
	isAuthenticated: boolean | null
) => {
	return useSWR<any, AxiosError>(
		isAuthenticated 
			? `/lastest-clients`
			: null,
		getDataDashBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}


