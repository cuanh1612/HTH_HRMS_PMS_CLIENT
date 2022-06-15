import { AxiosError } from 'axios'
import { currentUserRequest, logoutRequest } from 'requests/auth'
import useSWR from 'swr'
import { authMutaionResponse } from 'type/mutationResponses'

export const currentUserQuery = (isAuthenticated: boolean | null) => {
	return useSWR<authMutaionResponse, AxiosError>(
		isAuthenticated ? 'me' : null,
		currentUserRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}