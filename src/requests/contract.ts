import { createContractForm, updateContractForm } from 'type/form/basicFormType'
import { contractMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

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

// Handle to delete many contracts
export const deleteContractsRequest = async (ids: number[]) => {
	return await postData<contractMutaionResponse>({
		url: `http://localhost:4000/api/contracts/delete-many`,
		body: {
			contracts: ids,
		},
	})
}

//Handle to delete contract
export const deleteContractRequest = async (id: string | number) => {
	return await deleteData<contractMutaionResponse>({
		url: `http://localhost:4000/api/contracts/${id}`,
	})
}

//get public token
export async function  publicLinkRequest(idContract: string | number) {

	const resultFetch = await postData<contractMutaionResponse>({
		url: 'http://localhost:4000/api/contracts/public-link',
		body: {
			idContract: Number(idContract)
		},
	})

	return resultFetch
}

//get public contract
export async function  publicContractRequest(token: string | number) {

	const resultFetch = await getData<contractMutaionResponse>({
		url: `http://localhost:4000/api/contracts/public/${token}`,
	})

	return resultFetch
}


