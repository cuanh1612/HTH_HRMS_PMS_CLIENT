import { createTaskCategoryForm } from 'type/form/basicFormType'
import { TaskCategoryMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all task category
export const allTaskCategoryRequest = async (url: string) => {
	return await getData<TaskCategoryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create task category
export async function createTaskCategoryRequest(inputCreate: createTaskCategoryForm) {
	const resultFetch = await postData<TaskCategoryMutaionResponse>({
		url: 'http://localhost:4000/api/task-categories',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete task category
export async function deleteTaskCategoryRequest(inputDelete: { taskCategoryId: number }) {
	const resultFetch = await deleteData<TaskCategoryMutaionResponse>({
		url: `http://localhost:4000/api/task-categories/${inputDelete.taskCategoryId}`,
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
	const resultFetch = await putData<TaskCategoryMutaionResponse>({
		url: `http://localhost:4000/api/task-categories/${taskCategoryId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
