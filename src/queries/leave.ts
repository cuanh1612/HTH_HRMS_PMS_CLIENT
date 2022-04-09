import { AxiosError } from 'axios'
import { detailLeaveRequest } from 'requests/leave'
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