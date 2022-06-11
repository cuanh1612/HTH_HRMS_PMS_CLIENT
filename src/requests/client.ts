import { createClientForm, updateClientForm } from 'type/form/basicFormType'
import { clientMutaionResponse, clientProjectStatusMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create client
export async function createClientRequest(inputCreate: createClientForm) {
	const resultFetch = await postData<clientMutaionResponse>({
		url: 'http://localhost:4000/api/clients',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update client
export async function updateClientRequest({
	inputeUpdate,
	clientId,
}: {
	inputeUpdate: updateClientForm
	clientId: number
}) {
	const resultFetch = await putData<clientMutaionResponse>({
		url: `http://localhost:4000/api/clients/${clientId}`,
		body: inputeUpdate,
	})

	return resultFetch
}

//Function handle get all clients
export async function allClientsRequest(url: string) {
	const resultFetch = await getData<clientMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})

	return resultFetch
}

//Function handle get detail client
export async function detailClientRequest(url: string) {
	const resultFetch = await getData<clientMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})

	return resultFetch
}

//Function handle get count project status by client
export async function countProjectStatusRequest(url: string) {
	const resultFetch = await getData<clientProjectStatusMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})

	return resultFetch
}


//Handle to delete client
export const deleteClientRequest = async (id: string) => {
	return await deleteData<clientMutaionResponse>({
		url: `http://localhost:4000/api/clients/${id}`,
	})
}

// Handle to delete many clients
export const deleteClientsRequest = async (ids: number[]) => {
	return await postData<clientMutaionResponse>({
		url: `http://localhost:4000/api/clients/delete-many`,
		body: {
			clients: ids,
		},
	})
}

