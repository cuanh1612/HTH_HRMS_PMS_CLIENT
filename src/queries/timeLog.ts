import { AxiosError } from 'axios'
import { allTimeLogByProjectRequest, detailTimeLogRequest } from 'requests/timeLog'
import useSWR from 'swr'
import { TimeLogMutaionResponse } from 'type/mutationResponses'

export const detailTimeLogQuery = (
	isAuthenticated: boolean | null,
	timeLogId?: string | number
) => {
	return useSWR<TimeLogMutaionResponse, AxiosError>(
		isAuthenticated && timeLogId ? `time-logs/${timeLogId}` : null,
		detailTimeLogRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
export const timeLogsByProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | string[] | number
) => {
	return useSWR<TimeLogMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `time-logs/by-project/${projectId}` : null,
		allTimeLogByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const timeLogsQuery = (
	isAuthenticated: boolean | null,
) => {
	return useSWR<TimeLogMutaionResponse, AxiosError>(
		isAuthenticated ? `time-logs` : null,
		allTimeLogByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const timeLogsCurrentUserQuery = (
	isAuthenticated: boolean | null,
) => {
	return useSWR<TimeLogMutaionResponse, AxiosError>(
		isAuthenticated ? `time-logs/current-user` : null,
		allTimeLogByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const timeLogsCalendarQuery = ({
	isAuthenticated,
	employee,
	client,
	name,
	project,
}: {
	isAuthenticated: boolean | null
	employee?: number
	project?: number
	client?: number
	name?: string
}) => {
	const fieldUrl: string[] = []
	employee && fieldUrl.push(`employee=${employee}`)
	client && fieldUrl.push(`client=${client}`)
	name && fieldUrl.push(`name=${name}`)
	project && fieldUrl.push(`project=${project}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<TimeLogMutaionResponse, AxiosError>(
		isAuthenticated ? `time-logs/calendar${url}` : null,
		allTimeLogByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const timeLogsCalendarByEmployeeQuery = ({
	isAuthenticated,
	employee,
	client,
	name,
	project,
	employeeId
}: {
	isAuthenticated: boolean | null
	employee?: number
	project?: number
	client?: number
	name?: string
	employeeId?: string | number
}) => {
	const fieldUrl: string[] = []
	employee && fieldUrl.push(`employee=${employee}`)
	client && fieldUrl.push(`client=${client}`)
	name && fieldUrl.push(`name=${name}`)
	project && fieldUrl.push(`project=${project}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<TimeLogMutaionResponse, AxiosError>(
		isAuthenticated && employeeId? `time-logs/calendar-employee/${employeeId}${url}` : null,
		allTimeLogByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
