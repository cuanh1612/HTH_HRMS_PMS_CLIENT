import { AxiosError } from 'axios'
import useSWR from 'swr'
import { allUsersRequest } from 'requests/user'
import { userMutationResponse } from 'type/mutationResponses'

export const allUsersQuery = (isAuthenticated: boolean | null) => {
	return useSWR<userMutationResponse, AxiosError>(
		isAuthenticated ? 'users' : null,
		allUsersRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
