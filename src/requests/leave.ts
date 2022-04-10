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

//Function handle get all clients
export async function allLeavesRequest(url: string) {
	const resultFetch = await getData<leaveMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
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

//Function handle update status
export const updateStatusRequest = async ({
	status,
	leaveId,
}: {
	status: string
	leaveId: number
}) => {
	return await putData<leaveMutaionResponse>({
		url: `http://localhost:4000/api/leaves/status/${leaveId}`,
		body: {
			status
		}
	})
}
