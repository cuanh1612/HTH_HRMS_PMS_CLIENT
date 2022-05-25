import { AxiosError } from "axios"
import { allStatusRequest, allStatusTasksRequest, detailStatusRequest } from "requests/status"
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

export const allStatusQuery = (isAuthenticated: boolean | null, projectId: string | number | any) => {
	return useSWR<statusMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `status/normal/${projectId}`: null,
		allStatusRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailStatusQuery = (isAuthenticated: boolean | null, statusId: string | number | any) => {
	return useSWR<statusMutaionResponse, AxiosError>(
		isAuthenticated && statusId ? `status/detail/${statusId}`: null,
		detailStatusRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}



