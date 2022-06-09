import { createDesignationForm } from 'type/form/basicFormType'
import { DesignationMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all department
export const allDesignationRequest = async (url: string) => {
	return await getData<DesignationMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create designation
export async function createDesignationRequest(inputCreate: createDesignationForm) {
	const resultFetch = await postData<DesignationMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/designations`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete designation
export async function deleteDesignationRequest(inputDelete: { designationId: number }) {
	const resultFetch = await deleteData<DesignationMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/designations/${inputDelete.designationId}`,
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
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/designations/${designationId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
