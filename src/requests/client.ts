import { createClientForm } from 'type/form/auth'
import { clientMutaionResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//Function handle create client
export async function createClientRequest(inputCreate: createClientForm) {
	const resultFetch = await postData<clientMutaionResponse>({
		url: 'http://localhost:4000/api/clients',
		body: inputCreate,
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
