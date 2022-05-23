import { createTaskCommentForm, updateTaskCommentForm } from 'type/form/basicFormType'
import { TaskCommentMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create task comment
export async function createTaskCommentRequest(inputCreate: createTaskCommentForm) {
	const resultFetch = await postData<TaskCommentMutationResponse>({
		url: 'http://localhost:4000/api/task-comments',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get all task comments
export const allTaskCommentsRequest = async (url: string) => {
	return await getData<TaskCommentMutationResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle delete task Comment
export async function deleteTaskCommentRequest({ taskCommentId }: { taskCommentId: string | number }) {
	const resultFetch = await deleteData<TaskCommentMutationResponse>({
		url: `http://localhost:4000/api/task-comments/${taskCommentId}`,
	})

	return resultFetch
}

//Function handle update task Comment
export async function updateTaskCommentRequest({ taskCommentId, content }: updateTaskCommentForm) {
	const resultFetch = await putData<TaskCommentMutationResponse>({
		url: `http://localhost:4000/api/task-comments/${taskCommentId}`,
		body: {
			content,
		},
	})

	return resultFetch
}
