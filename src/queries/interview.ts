import { AxiosError } from 'axios'
import { getInterviewRequest } from 'requests/interview'
import { getJobApplicationRequest } from 'requests/jobApplication'
import useSWR from 'swr'
import { interviewMutationResponse, jobApplicationMutationResponse } from 'type/mutationResponses'

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

export const detailJobApplicationQuery = (
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
