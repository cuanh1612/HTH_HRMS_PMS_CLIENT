import { roomMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

export const allRoomsRequest = async (url: string) => {
	return await getData<roomMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
