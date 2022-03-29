import { AxiosError } from 'axios'
import { currentUserRequest } from 'requests/auth'
import useSWR from 'swr'
import { authMutaionResponse } from 'type/mutationResponses'

export const currentUserQuery = (isAuthenticated: boolean) => {
	return useSWR<authMutaionResponse, AxiosError>(
		isAuthenticated ? 'me' : null,
		currentUserRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
