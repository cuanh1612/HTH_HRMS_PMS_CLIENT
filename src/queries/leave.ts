import { AxiosError } from 'axios'
import { allLeavesRequest, detailLeaveRequest } from 'requests/leave'
import useSWR from 'swr'
import { leaveMutaionResponse } from 'type/mutationResponses'

export const detailLeaveQuery = (leaveId: number | string | null | undefined) => {
	return useSWR<leaveMutaionResponse, AxiosError>(
		leaveId ? `leaves/${leaveId}` : null,
		detailLeaveRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allLeaveQuery = (isAuthenticated: boolean | null) => {
	return useSWR<leaveMutaionResponse, AxiosError>(
		isAuthenticated ? `leaves` : null,
		allLeavesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}