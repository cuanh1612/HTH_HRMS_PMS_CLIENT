import { AxiosError } from 'axios'
import { detailTimeLogRequest } from 'requests/timeLog'
import useSWR from 'swr'
import { TimeLogMutaionResponse } from 'type/mutationResponses'

export const detailTimeLogQuery = (
	isAuthenticated: boolean | null,
	timeLogId: string | number | null | undefined
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
