import { createProjectTimeLogForm, updateProjectTimeLogForm } from 'type/form/basicFormType'
import { TimeLogMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createTimeLogRequest(inputCreate: createProjectTimeLogForm) {
	const resultFetch = await postData<TimeLogMutaionResponse>({
		url: 'http://localhost:4000/api/time-logs',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail timelog
export const detailTimeLogRequest = async (url: string) => {
	return await getData<TimeLogMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle get detail timelog
export const allTimeLogByProjectRequest = async (url: string) => {
	return await getData<TimeLogMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update TimeLog
export async function updateTimeLogRequest({
	inputUpdate,
	timeLogId,
}: {
	inputUpdate: updateProjectTimeLogForm
	timeLogId: number | string
}) {
	const resultFetch = await putData<TimeLogMutaionResponse>({
		url: `http://localhost:4000/api/time-logs/${timeLogId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Handle to delete time log
export const deleteTimeLogRequest = async (id: string) => {
	return await deleteData<TimeLogMutaionResponse>({
		url: `http://localhost:4000/api/time-logs/${id}`,
	})
}

// Handle to delete many time logs
export const deleteTimeLogsRequest = async (ids: number[]) => {
	return await postData<TimeLogMutaionResponse>({
		url: `http://localhost:4000/api/time-logs/delete-many`,
		body: {
			timelogs: ids,
		},
	})
}