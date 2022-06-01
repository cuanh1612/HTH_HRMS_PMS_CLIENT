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

export const allLeaveQuery = (input: {
	isAuthenticated?:boolean | undefined | null
	employee?: string | number,
	leaveType?: string,
	status?: string,
	date?: Date
}
) => {
	const fieldUrl: string[] = []
	input.employee && fieldUrl.push(`employee=${input.employee}`)
	input.leaveType && fieldUrl.push(`leaveType=${input.leaveType}`)
	input.status && fieldUrl.push(`status=${input.status}`)
	input.date && fieldUrl.push(`date=${new Date(input.date).toLocaleDateString()}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<leaveMutaionResponse, AxiosError>(
		input.isAuthenticated ? (url ? `leaves${url}` : 'leaves') : null,
		allLeavesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
