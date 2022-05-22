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

export const allLeaveQuery = (
	isAuthenticated: boolean | null,
	employee?: string,
	leaveType?: string,
	status?: string
) => {
	const fieldUrl: string[] = []
	employee && fieldUrl.push(`employee=${employee}`)
	leaveType && fieldUrl.push(`leaveType=${leaveType}`)
	status && fieldUrl.push(`status=${status}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<leaveMutaionResponse, AxiosError>(
		isAuthenticated ? (url ? `leaves${url}` : 'leaves') : null,
		allLeavesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
