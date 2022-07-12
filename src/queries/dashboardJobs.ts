import { AxiosError } from 'axios'
import { getDataDashBoardJobsRequest } from 'requests/dashboardJobs'
import useSWR from 'swr'

export const openJobsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? `/open-jobs` : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const applicationSourcesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/application-sources' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const applicationStatusQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/application-status' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const newInterviewQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/new-interview' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const todayInterviewQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/today-interview' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const todayInterviewCalendarQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/today-interview-calendar' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalApplicationsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/total-applications' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalHiredQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/total-hired' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalOpeningsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/total-openings' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const totalRejectedQuery = (isAuthenticated: boolean | null) => {
	return useSWR<any, AxiosError>(
		isAuthenticated ? '/total-rejected' : null,
		getDataDashBoardJobsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
