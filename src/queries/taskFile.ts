import { AxiosError } from 'axios'
import { allTaskFilesRequest } from 'requests/taskFile'
import useSWR from 'swr'
import { taskFileMutationResponse } from 'type/mutationResponses'

export const allTaskFilesQuery = (isAuthenticated: boolean | null, taskId: number | null) => {
	return useSWR<taskFileMutationResponse, AxiosError>(
		isAuthenticated && taskId ? `task-files/task/${taskId}` : null,
		allTaskFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
