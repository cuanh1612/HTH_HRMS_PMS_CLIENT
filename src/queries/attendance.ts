import { AxiosError } from 'axios'
import { allAttendancesRequest } from 'requests/attendance'
import useSWR from 'swr'
import { attendanceMutaionResponse } from 'type/mutationResponses'

export const allAttendancesQuery = (
	isAuthenticated: boolean | null,
	date?: Date,
	department?: string
) => {
	return useSWR<attendanceMutaionResponse, AxiosError>(
		isAuthenticated
			? date
				? department
					? `attendances?date=${date.toLocaleString()}`
					: `attendances?date=${date.toLocaleString()}&department=${department}`
				: 'attendances'
			: null,
		allAttendancesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
