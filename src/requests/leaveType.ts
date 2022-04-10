import { createLeaveTypeForm } from 'type/form/basicFormType'
import { leaveTypeMutaionResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//Function handle get all leave type
export const allLeaveTypesRequest = async (url: string) => {
	return await getData<leaveTypeMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create leave type
export async function createLeaveTypeRequest(inputCreate: createLeaveTypeForm) {
	const resultFetch = await postData<leaveTypeMutaionResponse>({
		url: 'http://localhost:4000/api/leave-types',
		body: inputCreate,
	})

	return resultFetch
}