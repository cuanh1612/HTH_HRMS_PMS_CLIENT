import { createContractForm, updateContractForm } from 'type/form/basicFormType'
import { contractMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create contract
export async function createContractRequest(inputCreate: createContractForm) {
	const resultFetch = await postData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle create contract by import csv 
export async function importCSVContractRequest(inputCreate: {contracts: createContractForm[]}) {
	const resultFetch = await postData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/csv`,
		body: inputCreate,
	})

	return resultFetch
}


//Function handle get detail contract
export const detailContractRequest = async (url: string) => {
	return await getData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${contractId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all employees
export const allContractsRequest = async (url: string) => {
	return await getData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// Handle to delete many contracts
export const deleteContractsRequest = async (ids: number[]) => {
	return await postData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/delete-many`,
		body: {
			contracts: ids,
		},
	})
}

//Handle to delete contract
export const deleteContractRequest = async (id: string | number) => {
	return await deleteData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${id}`,
	})
}

//get public token
export async function  publicLinkRequest(idContract: string | number) {

	const resultFetch = await postData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/public-link`,
		body: {
			idContract: Number(idContract)
		},
	})

	return resultFetch
}

//get public contract

export async function  publicContractRequest(token: string | number) {
	const resultFetch = await getData<contractMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/public/${token}`,
	})

	return resultFetch
}


