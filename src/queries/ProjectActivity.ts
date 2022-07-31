import { AxiosError } from 'axios'
import { allActivityByProjectRequest } from 'requests/task copy'
import useSWR from 'swr'
import { projectActivityMutationResponse } from 'type/mutationResponses'

export const allActivitiesByProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | string[] | number
) => {
	return useSWR<projectActivityMutationResponse, AxiosError>(
		isAuthenticated && projectId ? `project-activities/${projectId}` : null,
		allActivityByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
