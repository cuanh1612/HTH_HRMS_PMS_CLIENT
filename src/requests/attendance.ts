import { AttendanceForm } from "type/form/basicFormType"
import { attendanceMutaionResponse, commonResponse} from "type/mutationResponses"
import { getData, postData } from "utils/fetchData"

//Function handle get all attendance
export async function allAttendancesRequest(url: any) {
	const resultFetch = await getData<attendanceMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})

	return resultFetch
}

//Function handle create attendance
export async function createAttendanceRequest(inputCreate: AttendanceForm) {
	const resultFetch = await postData<commonResponse>({
		url: 'http://localhost:4000/api/attendances',
		body: inputCreate,
	})

	return resultFetch
}