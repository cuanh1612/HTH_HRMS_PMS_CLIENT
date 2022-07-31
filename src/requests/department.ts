import { createDepartmentForm } from 'type/form/basicFormType'
import { DepartmentMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all department
export const allDepartmentRequest = async (url: string) => {
	return await getData<DepartmentMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create department
export async function createDepartmentRequest(inputCreate: createDepartmentForm) {
	const resultFetch = await postData<DepartmentMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/departments`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete department
export async function deleteDepartmentRequest(inputDelete: { departmentId: number }) {
	const resultFetch = await deleteData<DepartmentMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/departments/${inputDelete.departmentId}`,
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
	const resultFetch = await putData<DepartmentMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/departments/${departmentId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
