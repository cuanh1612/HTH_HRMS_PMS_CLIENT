import { AxiosError } from 'axios'
import { allClientSubCategoryRequest } from 'requests/clientSubCategory'
import useSWR from 'swr'
import { ClientSubCategoryMutaionResponse } from 'type/mutationResponses'

export const allClientSubCategoriesQuery = () => {
	return useSWR<ClientSubCategoryMutaionResponse, AxiosError>(
		'client-sub-categories',
		allClientSubCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
