import { roomMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData } from 'utils/fetchData'

export const allRoomsRequest = async (url: string) => {
	return await getData<roomMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Handle to delete room
export const deleteRoomRequest = async (id: string) => {
	return await deleteData<roomMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`,
	})
}