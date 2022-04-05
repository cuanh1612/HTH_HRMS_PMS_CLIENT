import { createClientForm } from 'type/form/auth'
import { clientMutaionResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create client
export async function createClientRequest(inputCreate: createClientForm) {
	const resultFetch = await postData<clientMutaionResponse>({
		url: 'http://localhost:4000/api/clients',
		body: inputCreate,
	})

	return resultFetch
}
