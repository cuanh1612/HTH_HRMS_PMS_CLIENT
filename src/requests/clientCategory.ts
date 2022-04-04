import { ClientCategoryMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all client category
export const allClientCategoryRequest = async (url: string) => {
	return await getData<ClientCategoryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
