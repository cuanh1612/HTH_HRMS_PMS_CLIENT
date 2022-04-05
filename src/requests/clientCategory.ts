import { createCategoryForm } from 'type/form/auth'
import { ClientCategoryMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all client category
export const allClientCategoryRequest = async (url: string) => {
	return await getData<ClientCategoryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create client category
export async function createCategoryRequest(inputCreate: createCategoryForm) {
	const resultFetch = await postData<ClientCategoryMutaionResponse>({
		url: 'http://localhost:4000/api/client-categories',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete client category
export async function deleteCategoryRequest(inputDelete: { clientCategoryId: number }) {
	const resultFetch = await deleteData<ClientCategoryMutaionResponse>({
		url: `http://localhost:4000/api/client-categories/${inputDelete.clientCategoryId}`,
	})

	return resultFetch
}

//Function handle update category
export async function updateCategoryRequest({
	clientCategoryId,
	name,
}: {
	clientCategoryId: number
	name: string
}) {
	const resultFetch = await putData<ClientCategoryMutaionResponse>({
		url: `http://localhost:4000/api/client-categories/${clientCategoryId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
