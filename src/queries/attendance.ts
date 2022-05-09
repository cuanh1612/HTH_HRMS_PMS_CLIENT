import { AxiosError } from 'axios'
import { allAttendancesRequest } from 'requests/attendance'
import useSWR from 'swr'
import { attendanceMutaionResponse } from 'type/mutationResponses'

export const allAttendancesQuery = (isAuthenticated: boolean | null, date?: Date) => {

	return useSWR<attendanceMutaionResponse, AxiosError>(
		isAuthenticated ? (date ?  `attendances?date=${date.toLocaleString()}`: 'attendances') : null,
		allAttendancesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
