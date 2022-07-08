import { AxiosError } from 'axios'
import { getInterviewRequest } from 'requests/interview'
import useSWR from 'swr'
import { interviewMutationResponse } from 'type/mutationResponses'

export const allInterviewsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<interviewMutationResponse, AxiosError>(
		isAuthenticated ? 'interviews' : null,
		getInterviewRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailInterviewQuery = (
	isAuthenticated: boolean | null,
	interviewId: string | number | null
) => {
	return useSWR<interviewMutationResponse, AxiosError>(
		isAuthenticated && interviewId ? `interviews/${interviewId}` : null,
		getInterviewRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const interviewsByJobQuery = (
	isAuthenticated: boolean | null,
	jobId: string | number | null
) => {
	return useSWR<interviewMutationResponse, AxiosError>(
		isAuthenticated && jobId ? `interviews/job/${jobId}` : null,
		getInterviewRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
