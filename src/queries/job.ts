import { AxiosError } from 'axios'
import { getJobRequest } from 'requests/job'
import useSWR from 'swr'
import { jobMutationResponse } from 'type/mutationResponses'

export const allJobsQuery = () => {
	return useSWR<jobMutationResponse, AxiosError>('jobs', getJobRequest, {
		errorRetryCount: 2,
		revalidateOnFocus: false,
	})
}

export const detailJobQuery = ( jobId: string | number | null) => {
	return useSWR<jobMutationResponse, AxiosError>( jobId ? `jobs/${jobId}` : null, getJobRequest, {
		errorRetryCount: 2,
		revalidateOnFocus: false,
	})
}
