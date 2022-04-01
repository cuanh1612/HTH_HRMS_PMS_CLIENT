import { leaveTypeMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all employees
export const allLeaveTypesRequest = async (url: string) => {
	return await getData<leaveTypeMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
