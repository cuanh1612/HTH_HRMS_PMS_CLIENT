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

