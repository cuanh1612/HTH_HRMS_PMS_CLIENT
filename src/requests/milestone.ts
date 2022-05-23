import { milestoneForm } from "type/form/basicFormType"
import { milestoneMutaionResponse } from "type/mutationResponses"
import { deleteData, getData, postData, putData } from "utils/fetchData"

//Function handle create leave
export async function createMilestoneRequest(inputCreate: milestoneForm & {
    project?: string | string[]
}) {
	const resultFetch = await postData<milestoneMutaionResponse>({
		url: 'http://localhost:4000/api/milestone',
		body: inputCreate,
	})

	return resultFetch
}

// get all by project with task
export const allMilestoneRequest = async (url: string) => {
	return await getData<milestoneMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

// get all by project
export const allMilestoneNormalRequest = async (url: string) => {
	return await getData<milestoneMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}


//Handle to delete milestone
export const deleteMilestoneRequest = async (id: string) => {
	return await deleteData<milestoneMutaionResponse>({
		url: `http://localhost:4000/api/milestone/${id}`,
	})
}

//Function handle update milestone
export async function updateMilestoneRequest({
	inputUpdate,
	milestoneId,
}: {
	inputUpdate: milestoneForm
	milestoneId?: number | string | string []
}) {
	const resultFetch = await putData<milestoneMutaionResponse>({
		url: `http://localhost:4000/api/milestone/${milestoneId}`,
		body: inputUpdate,
	})

	return resultFetch
}
