import { createSubCategoryForm } from 'type/form/basicFormType'
import { ClientSubCategoryMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all client sub category
export const allClientSubCategoryRequest = async (url: string) => {
	return await getData<ClientSubCategoryMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create client sub category
export async function createSubCategoryRequest(inputCreate: createSubCategoryForm) {
	const resultFetch = await postData<ClientSubCategoryMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/client-sub-categories`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete client sub category
export async function deleteSubCategoryRequest(inputDelete: { clientCategoryId: number }) {
	const resultFetch = await deleteData<ClientSubCategoryMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/client-sub-categories/${inputDelete.clientCategoryId}`,
	})

	return resultFetch
}

//Function handle update category
export async function updateSubCategoryRequest({
	clientSubCategoryId,
	name,
}: {
	clientSubCategoryId: number
	name: string
}) {
	const resultFetch = await putData<ClientSubCategoryMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/client-sub-categories/${clientSubCategoryId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
