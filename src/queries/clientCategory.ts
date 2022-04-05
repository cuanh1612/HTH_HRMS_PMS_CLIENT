import { AxiosError } from 'axios'
import { allClientCategoryRequest } from 'requests/clientCategory'
import useSWR from 'swr'
import { ClientCategoryMutaionResponse } from 'type/mutationResponses'

export const allClientCategoriesQuery = () => {
	return useSWR<ClientCategoryMutaionResponse, AxiosError>(
		'client-categories',
		allClientCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
