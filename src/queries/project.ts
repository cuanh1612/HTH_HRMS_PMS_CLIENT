import { AxiosError } from 'axios'
import {
	allEmployeesInProjectRequest,
	allProjectsByClientNormalRequest,
	allProjectsByEmployeeNormalRequest,
	allProjectsByEmployeeRequest,
	allProjectsRequest,
	detailProjectRequest,
	employeesNotInProjectRequest,
} from 'requests/project'
import useSWR from 'swr'
import { employeeMutationResponse, projectMutationResponse } from 'type/mutationResponses'

export const detailProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | number | string[]
) => {
	return useSWR<projectMutationResponse, AxiosError>(
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
	projectId?: string | string[] | number
) => {
	return useSWR<employeeMutationResponse, AxiosError>(
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
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated && projectId ? `all-employees/${projectId}` : null,
		allEmployeesInProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects with info employees and client
export const allProjectsQuery = (isAuthenticated?: boolean | null) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated ? 'projects' : null,
		allProjectsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects with info employees and client
export const allProjectsByCurrentUserQuery = (
	isAuthenticated?: boolean | null,
) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated ? `projects/current-user` : null,
		allProjectsByEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects
export const allProjectsNormalQuery = (isAuthenticated?: boolean | null) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated ? 'projects/normal' : null,
		allProjectsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects normal by employee
export const allProjectsNormalByEmployeeQuery = (isAuthenticated?: boolean | null, employeeId?: string | number) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `projects/normal/employee/${employeeId}` : null,
		allProjectsByEmployeeNormalRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects normal by client
export const allProjectsNormalByClientQuery = (isAuthenticated?: boolean | null, clientId?: string | number) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated && clientId ? `projects/normal/client/${clientId}` : null,
		allProjectsByClientNormalRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const projectEarningsQuery = (isAuthenticated: boolean | null, idProject?: string | string[] | number) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}/earnings`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const projectHoursLoggedQuery = (isAuthenticated: boolean | null, idProject?: string | string[] | number) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}/Hours-logged`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const countStatusTasksQuery = (isAuthenticated: boolean | null, idProject?: string | string[] | number) => {
	return useSWR<projectMutationResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}/count-status-tasks`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
