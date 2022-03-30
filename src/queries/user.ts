import { AxiosError } from 'axios'
import useSWR from 'swr'
import { allUsersRequest } from 'requests/user'
import { userMutaionResponse } from 'type/mutationResponses'

export const allUsersQuery = (isAuthenticated: boolean | null) => {
	return useSWR<userMutaionResponse, AxiosError>(
		isAuthenticated ? 'users' : null,
		allUsersRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
