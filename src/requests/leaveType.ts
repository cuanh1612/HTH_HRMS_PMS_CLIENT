import { createLeaveTypeForm } from 'type/form/basicFormType'
import { leaveTypeMutaionResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//Function handle get all leave type
export const allLeaveTypesRequest = async (url: string) => {
	return await getData<leaveTypeMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create leave type
export async function createLeaveTypeRequest(inputCreate: createLeaveTypeForm) {
	const resultFetch = await postData<leaveTypeMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/leave-types`,
		body: inputCreate,
	})

	return resultFetch
}