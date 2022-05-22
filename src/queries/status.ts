import { AxiosError } from "axios"
import { allStatusTasksRequest } from "requests/status"
import useSWR from "swr"
import { statusMutaionResponse } from "type/mutationResponses"

export const allStatusTasksQuery = (isAuthenticated: boolean | null, projectId: string | number | any) => {
	return useSWR<statusMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `status/${projectId}`: null,
		allStatusTasksRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

