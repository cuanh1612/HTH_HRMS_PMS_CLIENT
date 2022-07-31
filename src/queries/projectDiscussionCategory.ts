import { AxiosError } from 'axios'
import { allProjectDiscussionCategoryRequest } from 'requests/projectDiscussionCategory'
import useSWR from 'swr'
import { projectDiscussionCategoryMutationResponse } from 'type/mutationResponses'

export const allProjectDiscussionCategoryQuery = (
	isAuthenticated: boolean | null,
) => {
	return useSWR<projectDiscussionCategoryMutationResponse, AxiosError>(
		isAuthenticated ? `project-discussion-categories` : null,
		allProjectDiscussionCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
