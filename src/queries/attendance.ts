import { AxiosError } from 'axios'
import { allAttendancesRequest } from 'requests/attendance'
import useSWR from 'swr'
import { attendanceMutaionResponse } from 'type/mutationResponses'

export const allAttendancesQuery = (
	isAuthenticated: boolean | null,
	date?: Date,
	department?: string,
	employee?: string
) => {
	const fieldUrl: string[] = []
	date && fieldUrl.push(`date=${date.toLocaleDateString()}`)
	department && fieldUrl.push(`department=${department}`)
	employee && fieldUrl.push(`employee=${employee}`)

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<attendanceMutaionResponse, AxiosError>(
		isAuthenticated ? (url ? `attendances${url}` : 'attendances') : null,
		allAttendancesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
