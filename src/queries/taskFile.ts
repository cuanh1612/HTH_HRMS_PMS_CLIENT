import { AxiosError } from 'axios'
import { allTaskFilesRequest } from 'requests/taskFile'
import useSWR from 'swr'
import { taskFileMutaionResponse } from 'type/mutationResponses'

export const allTaskFilesQuery = (isAuthenticated: boolean | null, taskId: number | null) => {
	return useSWR<taskFileMutaionResponse, AxiosError>(
		isAuthenticated && taskId ? `task-files/task/${taskId}` : null,
		allTaskFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
