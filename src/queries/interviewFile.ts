import { AxiosError } from 'axios'
import { allInterviewFilesRequest } from 'requests/interviewFile'
import useSWR from 'swr'
import { interviewFileMutationResponse } from 'type/mutationResponses'

export const allInterviewFilesQuery = (
	isAuthenticated: boolean | null,
	interviewId: number | null
) => {
	return useSWR<interviewFileMutationResponse, AxiosError>(
		isAuthenticated && interviewId ? `interview-files/interview/${interviewId}` : null,
		allInterviewFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
