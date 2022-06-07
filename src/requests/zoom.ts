import { roomMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData } from 'utils/fetchData'

export const allRoomsRequest = async (url: string) => {
	return await getData<roomMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Handle to delete room
export const deleteRoomRequest = async (id: string) => {
	return await deleteData<roomMutaionResponse>({
		url: `http://localhost:4000/api/rooms/${id}`,
	})
}