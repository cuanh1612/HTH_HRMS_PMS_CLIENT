import { AxiosError } from 'axios'
import { allLeaveTypesRequest } from 'requests/leaveType'
import useSWR from 'swr'
import { leaveTypeMutaionResponse } from 'type/mutationResponses'

export const allLeaveTypesQuery = () => {
	return useSWR<leaveTypeMutaionResponse, AxiosError>(`leave-types`, allLeaveTypesRequest, {
		errorRetryCount: 2,
		revalidateOnFocus: false,
	})
}
