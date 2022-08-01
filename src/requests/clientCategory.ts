import { createCategoryForm } from 'type/form/basicFormType'
import { ClientCategoryMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all client category
export const allClientCategoryRequest = async (url: string) => {
	return await getData<ClientCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create client category
export async function createCategoryRequest(inputCreate: createCategoryForm) {
	const resultFetch = await postData<ClientCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/client-categories`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete client category
export async function deleteCategoryRequest(inputDelete: { clientCategoryId: number }) {
	const resultFetch = await deleteData<ClientCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/client-categories/${inputDelete.clientCategoryId}`,
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
	const resultFetch = await putData<ClientCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/client-categories/${clientCategoryId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
