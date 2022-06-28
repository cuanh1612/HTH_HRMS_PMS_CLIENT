import { AxiosError } from 'axios'
import { getWorkExperienceRequest } from 'requests/workExperience'
import useSWR from 'swr'
import { workExperienceMutationResponse } from 'type/mutationResponses'

export const allWorkExperiencesQuery = (isAuthenticated: boolean | null) => {
	return useSWR<workExperienceMutationResponse, AxiosError>(
		isAuthenticated ? 'work-experiences' : null,
		getWorkExperienceRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailWorkExperienceQuery = (workExperienceId: string | number | null) => {
	return useSWR<workExperienceMutationResponse, AxiosError>(
		workExperienceId ? `work-experiences/${workExperienceId}` : null,
		getWorkExperienceRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
