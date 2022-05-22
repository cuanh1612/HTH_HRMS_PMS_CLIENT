import { commonResponse } from "type/mutationResponses"
import { deleteData, putData } from "utils/fetchData"

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
	[index: string]: number
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
