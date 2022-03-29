import { userMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

export const allUsersRequest = async (url: string) => {
	return await getData<userMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
