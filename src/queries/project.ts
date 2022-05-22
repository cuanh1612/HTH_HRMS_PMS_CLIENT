import { AxiosError } from 'axios'
import { allProjectsRequest, detailProjectRequest } from 'requests/project'
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

export const allProjectsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated ? 'projects': null,
		allProjectsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const projectDetailQuery = (isAuthenticated: boolean | null, idProject: string | number) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}








