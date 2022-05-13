import { AxiosError } from 'axios'
import { allProjectCategoryRequest } from 'requests/projectCategory'
import useSWR from 'swr'
import { ProjectCategoryMutaionResponse } from 'type/mutationResponses'

export const allProjectCategoriesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<ProjectCategoryMutaionResponse, AxiosError>(
		isAuthenticated ? 'project-categories' : null,
		allProjectCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
