import { AxiosError } from 'axios'
import { getJobOfferRequest } from 'requests/jobOfferLetter'
import useSWR from 'swr'
import { jobOfferLetterMutationResponse } from 'type/mutationResponses'

export const allJobOffersQuery = (isAuthenticated: boolean | null) => {
	return useSWR<jobOfferLetterMutationResponse, AxiosError>(
		isAuthenticated ? 'job-offer-letter' : null,
		getJobOfferRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailJobOfferQuery = (
	isAuthenticated: boolean | null,
	jobOfferLetterId: string | number | null
) => {
	return useSWR<jobOfferLetterMutationResponse, AxiosError>(
		isAuthenticated && jobOfferLetterId ? `job-offer-letters/${jobOfferLetterId}` : null,
		getJobOfferRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
