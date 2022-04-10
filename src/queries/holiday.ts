import { AxiosError } from 'axios'
import { detailHolidayRequest } from 'requests/holiday'
import useSWR from 'swr'
import { holidayMutaionResponse } from 'type/mutationResponses'

export const detailHolidayQuery = (holidayId: number | null) => {
	return useSWR<holidayMutaionResponse, AxiosError>(
		holidayId ? `holidays/${holidayId}` : null,
		detailHolidayRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
