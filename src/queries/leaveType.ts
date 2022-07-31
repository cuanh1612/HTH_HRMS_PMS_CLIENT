import { AxiosError } from 'axios'
import { allLeaveTypesRequest } from 'requests/leaveType'
import useSWR from 'swr'
import { leaveTypeMutationResponse } from 'type/mutationResponses'

export const allLeaveTypesQuery = () => {
	return useSWR<leaveTypeMutationResponse, AxiosError>(`leave-types`, allLeaveTypesRequest, {
		errorRetryCount: 2,
		revalidateOnFocus: false,
	})
}
