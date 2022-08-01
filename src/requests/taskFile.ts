import { createTaskFileForm } from 'type/form/basicFormType'
import { taskFileMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle create task file
export async function createTaskFileRequest(inputCreate: createTaskFileForm) {
	const resultFetch = await postData<taskFileMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/task-files`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete task file
export async function deleteTaskFileRequest(inputDelete: {
	taskFileId: number
	taskId: number
}) {
	const resultFetch = await deleteData<taskFileMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/task-files/${inputDelete.taskFileId}/task/${inputDelete.taskId}`,
	})

	return resultFetch
}

//Function handle get all task file
export const allTaskFilesRequest = async (url: string) => {
	return await getData<taskFileMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
