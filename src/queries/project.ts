import { AxiosError } from 'axios'
import { allEmployeesInProjectRequest, allProjectsRequest, detailProjectRequest, employeesNotInProjectRequest } from 'requests/project'
import useSWR from 'swr'
import { employeeMutaionResponse, projectMutaionResponse } from 'type/mutationResponses'

export const detailProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | number 
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

export const employeesNotInProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | string[]| number 
) => {
	return useSWR<employeeMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `projects/get-employees-not-in-project/${projectId}` : null,
		employeesNotInProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allEmployeesInProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | string[] | number 
) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `all-employees/${projectId}` : null,
		allEmployeesInProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}



export const allProjectsQuery = (isAuthenticated?: boolean | null) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated ? 'projects': null,
		allProjectsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const projectDetailQuery = (isAuthenticated: boolean | null, idProject?: string | number) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}








