import { AxiosError } from 'axios'
import { getJobRequest } from 'requests/job'
import useSWR from 'swr'
import { jobMutationResponse } from 'type/mutationResponses'

export const allJobsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<jobMutationResponse, AxiosError>(isAuthenticated ? 'jobs' : null, getJobRequest, {
		errorRetryCount: 2,
		revalidateOnFocus: false,
	})
}

export const detailJobQuery = (isAuthenticated: boolean | null, jobId: string | number | null) => {
	return useSWR<jobMutationResponse, AxiosError>((isAuthenticated && jobId) ? `jobs/${jobId}` : null, getJobRequest, {
		errorRetryCount: 2,
		revalidateOnFocus: false,
	})
}
