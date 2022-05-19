import { updateSalaryForm } from 'type/form/basicFormType'
import { SalaryMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle get all salary
export const allSalariesRequest = async (url: string) => {
	return await getData<SalaryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle get history salary
export const historySalaryRequest = async (url: string) => {
	return await getData<SalaryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle delete salary
export async function deleteSalaryRequest(inputDelete: { salaryId: number }) {
	const resultFetch = await deleteData<SalaryMutaionResponse>({
		url: `http://localhost:4000/api/salaries/${inputDelete.salaryId}`,
	})

	return resultFetch
}

//Function handle create/update salary
export async function updateSalaryRequest(inputCreate: updateSalaryForm) {
	const resultFetch = await postData<SalaryMutaionResponse>({
		url: 'http://localhost:4000/api/salaries',
		body: inputCreate,
	})

	return resultFetch
}