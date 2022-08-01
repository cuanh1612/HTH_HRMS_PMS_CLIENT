import { AxiosError } from 'axios'
import { allClientCategoryRequest } from 'requests/clientCategory'
import useSWR from 'swr'
import { ClientCategoryMutationResponse } from 'type/mutationResponses'

export const allClientCategoriesQuery = () => {
	return useSWR<ClientCategoryMutationResponse, AxiosError>(
		'client-categories',
		allClientCategoryRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
