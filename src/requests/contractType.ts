import { createContractTypeForm } from 'type/form/basicFormType'
import { contractTypeMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all contract types
export async function allContractTypesRequest(url: string) {
	const resultFetch = await getData<contractTypeMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})

	return resultFetch
}

//Function handle create department
export async function createContractTypeRequest(inputCreate: createContractTypeForm) {
	const resultFetch = await postData<contractTypeMutaionResponse>({
		url: 'http://localhost:4000/api/contract-types',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete department
export async function deleteContractTypeRequest(inputDelete: { contractTypeId: number }) {
	const resultFetch = await deleteData<contractTypeMutaionResponse>({
		url: `http://localhost:4000/api/contract-types/${inputDelete.contractTypeId}`,
	})

	return resultFetch
}

//Function handle update department
export async function updateContractTypeRequest({
	contractTypeId,
	name,
}: {
	contractTypeId: number
	name: string
}) {
	const resultFetch = await putData<contractTypeMutaionResponse>({
		url: `http://localhost:4000/api/contract-types/${contractTypeId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
