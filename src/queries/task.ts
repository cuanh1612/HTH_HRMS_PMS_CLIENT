import { AxiosError } from 'axios'
import { detailTaskRequest } from 'requests/task'
import useSWR from 'swr'
import { TaskMutaionResponse } from 'type/mutationResponses'

export const detailTaskQuery = (
	isAuthenticated: boolean | null,
	taskId: string | number | null | undefined
) => {
	return useSWR<TaskMutaionResponse, AxiosError>(
		isAuthenticated && taskId ? `tasks/${taskId}` : null,
		detailTaskRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
