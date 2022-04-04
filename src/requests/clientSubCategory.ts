import { ClientSubCategoryMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all client sub category
export const allClientSubCategoryRequest = async (url: string) => {
	return await getData<ClientSubCategoryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
