import { createLeaveForm, updateLeaveForm } from 'type/form/basicFormType'
import { leaveMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create leave
export async function createLeaveRequest(inputCreate: createLeaveForm) {
	const resultFetch = await postData<leaveMutaionResponse>({
		url: 'http://localhost:4000/api/leaves',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update leave
export async function updateLeaveRequest({
	inputUpdate,
	leaveId,
}: {
	inputUpdate: updateLeaveForm
	leaveId: number
}) {
	const resultFetch = await putData<leaveMutaionResponse>({
		url: `http://localhost:4000/api/leaves/${leaveId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get detail leave
export const detailLeaveRequest = async (url: string) => {
	return await getData<leaveMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
