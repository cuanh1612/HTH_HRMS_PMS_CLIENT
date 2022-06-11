import { userMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'


export const allUsersRequest = async (url: string) => {
	return await getData<userMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
