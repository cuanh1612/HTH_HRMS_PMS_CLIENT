import { createDepartmentForm } from 'type/form/auth'
import { DepartmentMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all department
export const allDepartmentRequest = async (url: string) => {
	return await getData<DepartmentMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create department
export async function createDepartmentRequest(inputCreate: createDepartmentForm) {
	const resultFetch = await postData<DepartmentMutaionResponse>({
		url: 'http://localhost:4000/api/departments',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete department
export async function deleteDepartmentRequest(inputDelete: { departmentId: number }) {
	const resultFetch = await deleteData<DepartmentMutaionResponse>({
		url: `http://localhost:4000/api/departments/${inputDelete.departmentId}`,
	})

	return resultFetch
}

//Function handle update department
export async function updateDepartmentRequest({
	departmentId,
	name,
}: {
	departmentId: number
	name: string
}) {
	const resultFetch = await putData<DepartmentMutaionResponse>({
		url: `http://localhost:4000/api/departments/${departmentId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
