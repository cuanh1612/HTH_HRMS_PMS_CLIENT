import { createSignatureForm } from 'type/form/basicFormType'
import { signMutationResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create sign for contract
export async function createSignContractRequest(inputCreate: createSignatureForm) {
	const resultFetch = await postData<signMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/signs/contract`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle create sign for job offer letter
export async function createSignJobOfferLetterRequest(inputCreate: createSignatureForm) {
	const resultFetch = await postData<signMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/signs/job-offer-letter`,
		body: inputCreate,
	})

	return resultFetch
}
