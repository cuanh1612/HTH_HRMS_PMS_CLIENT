import { createEmployeeForm } from 'type/form/auth'
import { employeeMutaionResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create employee
export async function createEmployeeRequest(inputLogin: createEmployeeForm) {
	const resultFetch = await postData<employeeMutaionResponse>({
		url: 'http://localhost:4000/api/employees',
		body: inputLogin,
	})

	return resultFetch
}
