import { AxiosError } from 'axios'
import { getSkillRequest } from 'requests/skill'
import useSWR from 'swr'
import { skillMutationResponse } from 'type/mutationResponses'

export const allSkillsQuery = (isAuthenticated: boolean | null) => {
	return useSWR<skillMutationResponse, AxiosError>(
		isAuthenticated ? 'skills' : null,
		getSkillRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailSkillQuery = (skillId: string | number | null) => {
	return useSWR<skillMutationResponse, AxiosError>(
		skillId ? `skills/${skillId}` : null,
		getSkillRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
