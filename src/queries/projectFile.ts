import { AxiosError } from 'axios'
import { allProjectFilesRequest } from 'requests/projectFile'
import useSWR from 'swr'
import { projectFileMutationResponse } from 'type/mutationResponses'

export const allProjectFilesQuery = (isAuthenticated: boolean | null, projectId: number | null) => {
	return useSWR<projectFileMutationResponse, AxiosError>(
		isAuthenticated && projectId ? `project-files/project/${projectId}` : null,
		allProjectFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
