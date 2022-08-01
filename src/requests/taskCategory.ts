import { createTaskCategoryForm } from 'type/form/basicFormType'
import { TaskCategoryMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all task category
export const allTaskCategoryRequest = async (url: string) => {
	return await getData<TaskCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create task category
export async function createTaskCategoryRequest(inputCreate: createTaskCategoryForm) {
	const resultFetch = await postData<TaskCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/task-categories`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete task category
export async function deleteTaskCategoryRequest(inputDelete: { taskCategoryId: number }) {
	const resultFetch = await deleteData<TaskCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/task-categories/${inputDelete.taskCategoryId}`,
	})

	return resultFetch
}

//Function handle update task category
export async function updateTaskCategoryRequest({
	taskCategoryId,
	name,
}: {
	taskCategoryId: number
	name: string
}) {
	const resultFetch = await putData<TaskCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/task-categories/${taskCategoryId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
