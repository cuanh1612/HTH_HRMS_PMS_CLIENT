import { AxiosError } from 'axios'
import { getJobTypeRequest } from 'requests/jobType'
import useSWR from 'swr'
import { jobTypeMutationResponse } from 'type/mutationResponses'

export const allJobTypesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<jobTypeMutationResponse, AxiosError>(
		isAuthenticated ? 'job-types' : null,
		getJobTypeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailJobTypeQuery = (jobTypeId: string | number | null) => {
	return useSWR<jobTypeMutationResponse, AxiosError>(
		jobTypeId ? `job-types/${jobTypeId}` : null,
		getJobTypeRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
