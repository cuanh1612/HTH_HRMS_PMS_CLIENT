import { AxiosError } from 'axios'
import { allTaskCategoryRequest } from 'requests/taskCategory'
import useSWR from 'swr'
import { TaskCategoryMutaionResponse } from 'type/mutationResponses'

export const allTaskCategoriesQuery = () => {
	return useSWR<TaskCategoryMutaionResponse, AxiosError>(
		'task-categories',
		allTaskCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
