import { AttendanceForm } from "type/form/basicFormType"
import { attendanceMutaionResponse, commonResponse} from "type/mutationResponses"
import { getData, postData } from "utils/fetchData"

//Function handle get all attendance
export async function allAttendancesRequest(url: any) {
	const resultFetch = await getData<attendanceMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})

	return resultFetch
}

//Function handle create attendance
export async function createAttendanceRequest(inputCreate: AttendanceForm) {
	const resultFetch = await postData<commonResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/attendances`,
		body: inputCreate,
	})

	return resultFetch
}