import { statusForm } from "type/form/basicFormType"
import { statusMutationResponse } from "type/mutationResponses"
import { deleteData, getData, postData, putData } from "utils/fetchData"

// get all
export const allStatusTasksRequest = async (url: string) => {
	return await getData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all status normal
export const allStatusRequest = async (url: string) => {
	return await getData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get detail status 
export const detailStatusRequest = async (url: string) => {
	return await getData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}


//Function handle to change position
export async function changePositionRequest({
	idStatus1,
	idStatus2,
	projectId
}: {
	idStatus1: number
	projectId: number
	idStatus2: number
}) {
	const resultFetch = await putData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/status/position`,
		body: {
			id1: idStatus1,
			id2: idStatus2,
			projectId
		},
	})
	return resultFetch
}

// create status column
export async function createStatusColumnRequest(inputCreate: statusForm & {
	projectId?: string | string[]
}) {
	const resultFetch = await postData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/status`,
		body: inputCreate,
	})

	return resultFetch
}

//Handle to delete status column
export const deleteStatusColumnRequest = async (id: string) => {
	return await deleteData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/status/${id}`,
	})
}

//Function handle update employee
export async function updateStatusRequest({
	inputUpdate,
	columnId,
}: {
	inputUpdate: statusForm
	columnId: string
}) {
	const resultFetch = await putData<statusMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/status/${columnId}`,
		body: inputUpdate,
	})

	return resultFetch
}

