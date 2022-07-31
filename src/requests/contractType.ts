import { createContractTypeForm } from 'type/form/basicFormType'
import { contractTypeMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all contract types
export async function allContractTypesRequest(url: string) {
	const resultFetch = await getData<contractTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})

	return resultFetch
}

//Function handle create department
export async function createContractTypeRequest(inputCreate: createContractTypeForm) {
	const resultFetch = await postData<contractTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contract-types`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete department
export async function deleteContractTypeRequest(inputDelete: { contractTypeId: number }) {
	const resultFetch = await deleteData<contractTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contract-types/${inputDelete.contractTypeId}`,
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
	const resultFetch = await putData<contractTypeMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contract-types/${contractTypeId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
