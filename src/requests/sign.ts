import { createSignatureForm } from 'type/form/basicFormType'
import { signMutationResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create sign
export async function createSignRequest(inputCreate: createSignatureForm) {
	const resultFetch = await postData<signMutationResponse>({
		url: 'http://localhost:4000/api/signs',
		body: inputCreate,
	})

	return resultFetch
}
