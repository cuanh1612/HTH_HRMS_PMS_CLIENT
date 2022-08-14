import { AxiosError } from 'axios'
import { getLocationRequest } from 'requests/location'
import useSWR from 'swr'
import { locationMutationResponse } from 'type/mutationResponses'

export const allLocationsQuery = () => {
	return useSWR<locationMutationResponse, AxiosError>(
		'locations',
		getLocationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailLocationQuery = (locationId: string | number | null) => {
	return useSWR<locationMutationResponse, AxiosError>(
		locationId ? `locations/${locationId}` : null,
		getLocationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
