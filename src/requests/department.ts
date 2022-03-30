import { DepartmentMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all department
export const allDepartmentRequest = async (url: string) => {
	return await getData<DepartmentMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
