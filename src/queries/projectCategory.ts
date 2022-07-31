import { AxiosError } from 'axios'
import { allProjectCategoryRequest } from 'requests/projectCategory'
import useSWR from 'swr'
import { ProjectCategoryMutationResponse } from 'type/mutationResponses'

export const allProjectCategoriesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<ProjectCategoryMutationResponse, AxiosError>(
		isAuthenticated ? 'project-categories' : null,
		allProjectCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
