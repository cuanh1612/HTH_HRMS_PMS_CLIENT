import { AxiosError } from 'axios'
import { allClientSubCategoryRequest } from 'requests/clientSubCategory'
import useSWR from 'swr'
import { ClientSubCategoryMutationResponse } from 'type/mutationResponses'

export const allClientSubCategoriesQuery = () => {
	return useSWR<ClientSubCategoryMutationResponse, AxiosError>(
		'client-sub-categories',
		allClientSubCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
