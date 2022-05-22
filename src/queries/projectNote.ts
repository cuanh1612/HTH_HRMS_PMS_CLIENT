import { AxiosError } from 'axios'
import { allProjectNotesRequest, detailProjectNoteRequest } from 'requests/projectNote'
import useSWR from 'swr'
import { ProjectNoteMutaionResponse } from 'type/mutationResponses'

export const detailProjectNoteRoomQuery = (
	isAuthenticated: boolean | null,
	projectNoteId: number | null
) => {
	return useSWR<ProjectNoteMutaionResponse, AxiosError>(
		isAuthenticated && projectNoteId ? `project-notes/${projectNoteId}` : null,
		detailProjectNoteRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allProjectNotesQuery = (isAuthenticated: boolean | null, projectId: string | number | null) => {
	return useSWR<ProjectNoteMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `project-notes/project/${projectId}` : null,
		allProjectNotesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

