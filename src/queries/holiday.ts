import { AxiosError } from 'axios'
import { allHolidaysRequest, detailHolidayRequest } from 'requests/holiday'
import useSWR from 'swr'
import { holidayMutationResponse } from 'type/mutationResponses'

export const detailHolidayQuery = (holidayId: string | number | null) => {
	return useSWR<holidayMutationResponse, AxiosError>(
		holidayId ? `holidays/${holidayId}` : null,
		detailHolidayRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allHolidaysQuery = (input: { month?: number| string, year?: number| string}) => {
	var url = 'holidays'
	const fieldUrl: string[] = []
	input?.month && fieldUrl.push(`month=${input.month}`)
	input?.year && fieldUrl.push(`year=${input.year}`)

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<holidayMutationResponse, AxiosError>(
		url,
		allHolidaysRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
