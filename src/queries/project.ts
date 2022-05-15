import { AxiosError } from 'axios'
import { detailProjectRequest } from 'requests/project'
import useSWR from 'swr'
import { projectMutaionResponse } from 'type/mutationResponses'

export const detailProjectQuery = (
	isAuthenticated: boolean | null,
	projectId: string | number | null | undefined
) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `projects/${projectId}` : null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
