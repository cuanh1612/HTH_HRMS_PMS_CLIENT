import { AxiosError } from 'axios'
import { allDiscussionsRequest } from 'requests/discussion'
import useSWR from 'swr'
import { DiscussionMutationResponse } from 'type/mutationResponses'

export const allDiscussionsQuery = (isAuthenticated: boolean | null, contractId: number | undefined) => {
	return useSWR<DiscussionMutationResponse, AxiosError>(
		isAuthenticated && contractId ? `discussions/contract/${contractId}` : null,
		allDiscussionsRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
