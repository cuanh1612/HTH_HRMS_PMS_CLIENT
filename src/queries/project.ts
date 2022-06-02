import { AxiosError } from 'axios'
import {
	allEmployeesInProjectRequest,
	allProjectsByEmployeeNormalRequest,
	allProjectsByEmployeeRequest,
	allProjectsRequest,
	detailProjectRequest,
	employeesNotInProjectRequest,
} from 'requests/project'
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
	projectId?: string | string[] | number
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

// get all projects with info employees and client
export const allProjectsQuery = (isAuthenticated?: boolean | null) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated ? 'projects' : null,
		allProjectsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects with info employees and client
export const allProjectsByEmployeeQuery = (
	isAuthenticated?: boolean | null,
	employeeId?: string | number
) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `projects/employee/${employeeId}` : null,
		allProjectsByEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

// get all projects
export const allProjectsNormalQuery = (isAuthenticated?: boolean | null) => {
	return useSWR<projectMutaionResponse, AxiosError>(
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
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && employeeId ? `projects/normal/employee/${employeeId}` : null,
		allProjectsByEmployeeNormalRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const projectEarningsQuery = (isAuthenticated: boolean | null, idProject?: string | string[] | number) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}/earnings`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const projectHoursLoggedQuery = (isAuthenticated: boolean | null, idProject?: string | string[] | number) => {
	return useSWR<projectMutaionResponse, AxiosError>(
		isAuthenticated && idProject ? `projects/${idProject}/Hours-logged`: null,
		detailProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}







