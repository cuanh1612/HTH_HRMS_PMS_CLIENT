import { AxiosError } from 'axios'
import { allAttendancesRequest } from 'requests/attendance'
import useSWR from 'swr'
import { attendanceMutaionResponse } from 'type/mutationResponses'

export const allAttendancesQuery = (
	isAuthenticated: boolean | null,
	date?: Date,
	department?: string
) => {
	var url = ''
	if(isAuthenticated) {
		if(date && department) {
			url = `attendances?date=${date.toLocaleString()}&department=${department}`
		} else {
			if(date) {
				url = `attendances?date=${date.toLocaleString()}`
			}
			if(department) {
				url = `attendances?department=${department}`
			}
		}
	}
	
	return useSWR<attendanceMutaionResponse, AxiosError>(
		url ? url : null,
		allAttendancesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
