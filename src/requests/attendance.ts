import { attendanceMutaionResponse, clientMutaionResponse } from "type/mutationResponses"
import { getData } from "utils/fetchData"

//Function handle get all attendance
export async function allAttendancesRequest(url: string) {
	const resultFetch = await getData<attendanceMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})

	return resultFetch
}