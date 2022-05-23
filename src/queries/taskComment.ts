import { AxiosError } from 'axios'
import { allTaskCommentsRequest } from 'requests/taskComment'
import useSWR from 'swr'
import { TaskCommentMutationResponse } from 'type/mutationResponses'

export const allTaskCommentsQuery = (
	isAuthenticated: boolean | null,
	taskId: number | undefined
) => {
	return useSWR<TaskCommentMutationResponse, AxiosError>(
		isAuthenticated && taskId ? `task-comments/task/${taskId}` : null,
		allTaskCommentsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
