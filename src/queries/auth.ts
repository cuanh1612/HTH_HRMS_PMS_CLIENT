import { AxiosError } from 'axios'
import { currentUserRequest } from 'requests/auth'
import useSWR from 'swr'
import { authMutationResponse } from 'type/mutationResponses'

export const currentUserQuery = (isAuthenticated: boolean | null) => {
	return useSWR<authMutationResponse, AxiosError>(
		isAuthenticated ? 'me' : null,
		currentUserRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}