import { milestoneForm } from "type/form/basicFormType"
import { milestoneMutationResponse } from "type/mutationResponses"
import { deleteData, getData, postData, putData } from "utils/fetchData"

//Function handle create leave
export async function createMilestoneRequest(inputCreate: milestoneForm & {
    project?: string | string[]
}) {
	const resultFetch = await postData<milestoneMutationResponse>({
	url: `${process.env.NEXT_PUBLIC_API_URL}/api/milestone`,
		body: inputCreate,
	})

	return resultFetch
}

// get all by project with task
export const allMilestoneRequest = async (url: string) => {
	return await getData<milestoneMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all by project
export const allMilestoneNormalRequest = async (url: string) => {
	return await getData<milestoneMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get detail milestone
export const detailMilestoneRequest = async (url: string) => {
	return await getData<milestoneMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}


//Handle to delete milestone
export const deleteMilestoneRequest = async (id: string) => {
	return await deleteData<milestoneMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/milestone/${id}`,
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
	const resultFetch = await putData<milestoneMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/milestone/${milestoneId}`,
		body: inputUpdate,
	})

	return resultFetch
}
