import { createDesignationForm } from 'type/form/basicFormType'
import { DesignationMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all department
export const allDesignationRequest = async (url: string) => {
	return await getData<DesignationMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create designation
export async function createDesignationRequest(inputCreate: createDesignationForm) {
	const resultFetch = await postData<DesignationMutaionResponse>({
		url: 'http://localhost:4000/api/designations',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete designation
export async function deleteDesignationRequest(inputDelete: { designationId: number }) {
	const resultFetch = await deleteData<DesignationMutaionResponse>({
		url: `http://localhost:4000/api/designations/${inputDelete.designationId}`,
	})

	return resultFetch
}

//Function handle update designation
export async function updateDesignationRequest({
	designationId,
	name,
}: {
	designationId: number
	name: string
}) {
	const resultFetch = await putData<DesignationMutaionResponse>({
		url: `http://localhost:4000/api/designations/${designationId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
