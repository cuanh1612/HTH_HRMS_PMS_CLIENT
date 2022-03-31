import { createEmployeeForm, updateEmployeeForm } from 'type/form/auth'
import { employeeMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create employee
export async function createEmployeeRequest(inputCreate: createEmployeeForm) {
	const resultFetch = await postData<employeeMutaionResponse>({
		url: 'http://localhost:4000/api/employees',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update employee
export async function updateEmployeeRequest({
	inputUpdate,
	employeeId,
}: {
	inputUpdate: updateEmployeeForm
	employeeId: number
}) {
	const resultFetch = await putData<employeeMutaionResponse>({
		url: `http://localhost:4000/api/employees/${employeeId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get detail employee
export const detailEmployeeRequest = async (url: string) => {
	return await getData<employeeMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
