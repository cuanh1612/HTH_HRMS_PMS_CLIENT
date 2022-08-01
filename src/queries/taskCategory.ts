import { AxiosError } from 'axios'
import { allTaskCategoryRequest } from 'requests/taskCategory'
import useSWR from 'swr'
import { TaskCategoryMutationResponse } from 'type/mutationResponses'

export const allTaskCategoriesQuery = () => {
	return useSWR<TaskCategoryMutationResponse, AxiosError>(
		'task-categories',
		allTaskCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
