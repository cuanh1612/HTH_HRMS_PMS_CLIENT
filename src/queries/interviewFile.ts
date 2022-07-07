import { AxiosError } from 'axios'
import { allInterviewFilesRequest } from 'requests/interviewFile'
import useSWR from 'swr'
import { interviewFileMutaionResponse } from 'type/mutationResponses'

export const allInterviewFilesQuery = (
	isAuthenticated: boolean | null,
	interviewId: number | null
) => {
	return useSWR<interviewFileMutaionResponse, AxiosError>(
		isAuthenticated && interviewId ? `interview-files/interview/${interviewId}` : null,
		allInterviewFilesRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
