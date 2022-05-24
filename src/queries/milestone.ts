import { AxiosError } from "axios"
import { allMilestoneNormalRequest, allMilestoneRequest } from "requests/milestone"
import useSWR from "swr"
import { milestoneMutaionResponse } from "type/mutationResponses"



export const milestonesByProjectQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | number | string[]
) => {
	return useSWR<milestoneMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `milestone/${projectId}` : null,
		allMilestoneRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailMilestoneQuery = (
	isAuthenticated: boolean | null,
	milestoneId?: string | number
) => {
	return useSWR<milestoneMutaionResponse, AxiosError>(
		isAuthenticated && milestoneId ? `milestone/detail/${milestoneId}` : null,
		allMilestoneRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const milestonesByProjectNormalQuery = (
	isAuthenticated: boolean | null,
	projectId?: string | number | string[]
) => {
	return useSWR<milestoneMutaionResponse, AxiosError>(
		isAuthenticated && projectId ? `milestone/normal/${projectId}` : null,
		allMilestoneNormalRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}



