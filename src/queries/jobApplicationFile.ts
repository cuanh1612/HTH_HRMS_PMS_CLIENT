import { AxiosError } from 'axios'
import { allJobApplicationFilesRequest } from 'requests/jobApplicationFile'
import useSWR from 'swr'
import { jobApplicationFileMutaionResponse } from 'type/mutationResponses'

export const allJobApplicationFilesQuery = (
	isAuthenticated: boolean | null,
	jobApplicationId: number | null
) => {
	return useSWR<jobApplicationFileMutaionResponse, AxiosError>(
		isAuthenticated && jobApplicationId
			? `job-application-files/job-application/${jobApplicationId}`
			: null,
		allJobApplicationFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
