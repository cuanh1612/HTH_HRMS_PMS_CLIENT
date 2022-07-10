import { AxiosError } from 'axios'
import { getJobApplicationRequest } from 'requests/jobApplication'
import useSWR from 'swr'
import { jobApplicationMutationResponse } from 'type/mutationResponses'

export const allJobApplicationsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<jobApplicationMutationResponse, AxiosError>(
		isAuthenticated ? 'job-applications' : null,
		getJobApplicationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailJobApplicationQuery = (
	isAuthenticated: boolean | null,
	jobApplicationId: string | number | null
) => {
	return useSWR<jobApplicationMutationResponse, AxiosError>(
		isAuthenticated && jobApplicationId ? `job-applications/${jobApplicationId}` : null,
		getJobApplicationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const applicationsByJobQuery = (
	isAuthenticated: boolean | null,
	jobId?: string | number | null
) => {
	return useSWR<jobApplicationMutationResponse, AxiosError>(
		isAuthenticated && jobId ? `job-applications/job/${jobId}` : null,
		getJobApplicationRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

