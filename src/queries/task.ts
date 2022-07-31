import { AxiosError } from 'axios'
import {
	allTaskByProjectRequest,
	allTasksByEmployeeRequest,
	allTasksRequest,
	detailTaskRequest
} from 'requests/task'
import useSWR from 'swr'
import { TaskMutationResponse } from 'type/mutationResponses'

export const detailTaskQuery = (
	isAuthenticated: boolean | null,
	taskId: string | number | null | undefined
) => {
	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated && taskId ? `tasks/${taskId}` : null,
		detailTaskRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksByProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | string[] | number
) => {
	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated && projectId ? `tasks/project/${projectId}` : null,
		allTaskByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksQuery = (isAuthenticated: boolean | null) => {
	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated ? `tasks` : null,
		allTasksRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksByEmployeeQuery = (
	isAuthenticated: boolean | null,
	employeeId?: number | string
) => {
	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `tasks/employee/${employeeId}` : null,
		allTasksByEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksByEmployeeAndProjectQuery = (
	isAuthenticated: boolean | null,
	employeeId?: number | string,
	projectId?: number | string
) => {
	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `tasks/project/${projectId}/employee/${employeeId}` : null,
		allTasksByEmployeeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksCalendarQuery = ({
	isAuthenticated,
	employee,
	client,
	name,
	project,
}: {
	isAuthenticated: boolean | null
	employee?: number
	project?: number
	client?: number
	name?: string
}) => {
	const fieldUrl: string[] = []
	employee && fieldUrl.push(`employee=${employee}`)
	client && fieldUrl.push(`client=${client}`)
	name && fieldUrl.push(`name=${name}`)
	project && fieldUrl.push(`project=${project}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated ? `tasks/calendar${url}` : null,
		allTasksRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksCalendarByEmployeeQuery = ({
	isAuthenticated,
	employee,
	client,
	name,
	project,
	employeeId
}: {
	isAuthenticated: boolean | null
	employee?: number
	project?: number
	client?: number
	name?: string
	employeeId?: number | string
}) => {
	const fieldUrl: string[] = []
	employee && fieldUrl.push(`employee=${employee}`)
	client && fieldUrl.push(`client=${client}`)
	name && fieldUrl.push(`name=${name}`)
	project && fieldUrl.push(`project=${project}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<TaskMutationResponse, AxiosError>(
		isAuthenticated && employeeId ? `tasks/calendar-employee/${employeeId}${url}` : null,
		allTasksRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

