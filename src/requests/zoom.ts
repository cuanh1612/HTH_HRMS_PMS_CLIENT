import { roomMutationResponse } from 'type/mutationResponses'
import { deleteData, getData } from 'utils/fetchData'

export const allRoomsRequest = async (url: string) => {
	return await getData<roomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Handle to delete room
export const deleteRoomRequest = async (id: string) => {
	return await deleteData<roomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`,
	})
}