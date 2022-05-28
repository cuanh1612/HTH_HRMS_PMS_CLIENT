import { AxiosError } from 'axios'
import { allTaskByProjectRequest, allTasksRequest, detailTaskRequest } from 'requests/task'
import useSWR from 'swr'
import { TaskMutaionResponse } from 'type/mutationResponses'

export const detailTaskQuery = (
	isAuthenticated: boolean | null,
	taskId: string | number | null | undefined
) => {
	return useSWR<TaskMutaionResponse, AxiosError>(
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
	return useSWR<TaskMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `tasks/project/${projectId}` : null,
		allTaskByProjectRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allTasksQuery = (isAuthenticated: boolean | null) => {
	return useSWR<TaskMutaionResponse, AxiosError>(
		isAuthenticated ? `tasks` : null,
		allTasksRequest,
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

	return useSWR<TaskMutaionResponse, AxiosError>(
		isAuthenticated ? `tasks/calendar${url}` : null,
		allTasksRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
