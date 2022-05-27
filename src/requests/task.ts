import { createProjectTaskForm, updateProjectTaskForm } from "type/form/basicFormType"
import { commonResponse, TaskMutaionResponse } from "type/mutationResponses"
import { deleteData, getData, postData, putData } from "utils/fetchData"

//Handle to delete task
export const deleteTaskRequest = async (id: string) => {
	return await deleteData<commonResponse>({
		url: `http://localhost:4000/api/tasks/${id}`,
	})
}

//Function handle to change position
export async function changePositionRequest({
	id1,
	id2,
	status1,
	status2
}: {
	id1: number
	id2?: number
	status1: number
	status2: number
}) {
	const resultFetch = await putData<commonResponse>({
		url: `http://localhost:4000/api/tasks/position`,
		body: {
			id1,
			id2,
			status1,
			status2
		},
	})
	return resultFetch
}

//Function handle create
export async function createTaskRequest(inputCreate: createProjectTaskForm) {
	const resultFetch = await postData<TaskMutaionResponse>({
		url: 'http://localhost:4000/api/tasks',
		body: inputCreate,
	})

	return resultFetch
}


//Function handle get detail task
export const detailTaskRequest = async (url: string) => {
	return await getData<TaskMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle get all task
export const allTaskByProjectRequest = async (url: string) => {
	return await getData<TaskMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}


//Function handle update task
export async function updateTaskRequest({
	inputUpdate,
	taskId,
}: {
	inputUpdate: updateProjectTaskForm
	taskId: number | string
}) {
	const resultFetch = await putData<TaskMutaionResponse>({
		url: `http://localhost:4000/api/tasks/${taskId}`,
		body: inputUpdate,
	})

	return resultFetch
}

// Handle to delete many leave
export const deleteTasksRequest = async (ids: number[]) => {
	return await postData<TaskMutaionResponse>({
		url: `http://localhost:4000/api/tasks/delete-many`,
		body: {
			tasks: ids,
		},
	})
}

