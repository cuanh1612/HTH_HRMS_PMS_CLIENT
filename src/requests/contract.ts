import { createContractForm, updateContractForm } from 'type/form/basicFormType'
import { contractMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create contract
export async function createContractRequest(inputCreate: createContractForm) {
	const resultFetch = await postData<contractMutaionResponse>({
		url: 'http://localhost:4000/api/contracts',
		body: inputCreate,
	})

	return resultFetch
}


//Function handle get detail contract
export const detailContractRequest = async (url: string) => {
	return await getData<contractMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update contract
export async function updateContractRequest({
	inputUpdate,
	contractId,
}: {
	inputUpdate: updateContractForm
	contractId: number
}) {
	const resultFetch = await putData<contractMutaionResponse>({
		url: `http://localhost:4000/api/contracts/${contractId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all employees
export const allContractsRequest = async (url: string) => {
	return await getData<contractMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}