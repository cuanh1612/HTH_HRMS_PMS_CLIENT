import { createProjectTimeLogForm } from 'type/form/basicFormType'
import { TimeLogMutaionResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

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
