import { TimeLogMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get notification by current user
export const notificationByCurrentUserRequest = async (url: string) => {
	return await getData<TimeLogMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
