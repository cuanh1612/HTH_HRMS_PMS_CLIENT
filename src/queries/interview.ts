import { AxiosError } from 'axios'
import { getInterviewNewRequest, getInterviewRequest } from 'requests/interview'
import useSWR from 'swr'
import { interviewMutationResponse } from 'type/mutationResponses'

export interface IOptionInterview {
	interviewer?: number
	date?: Date
	status?: string
}

export const allInterviewsQuery = (isAuthenticated: boolean | null, input?: IOptionInterview) => {
	const fieldUrl: string[] = []
	if (input) {
		input.interviewer && fieldUrl.push(`interviewer=${input.interviewer}`)
		input.status && fieldUrl.push(`status=${input.status}`)
		input.date && fieldUrl.push(`date=${new Date(input.date)}`)
	}

	var url = ''

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<interviewMutationResponse, AxiosError>(
		isAuthenticated ? (url ? `interviews${url}` : 'interviews') : null,
		getInterviewRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allInterviewsNewQuery = (isAuthenticated: boolean | null) => {
	return useSWR<interviewMutationResponse, AxiosError>(
		isAuthenticated ? 'interviews/new' : null,
		getInterviewNewRequest,
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
