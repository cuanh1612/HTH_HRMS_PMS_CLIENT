import { createRoomForm, updateRoomForm } from 'type/form/basicFormType'
import { roomMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createRoomRequest(inputCreate: createRoomForm) {
	const resultFetch = await postData<roomMutaionResponse>({
		url: 'http://localhost:4000/api/rooms',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail 
export const detailRoomRequest = async (url: string) => {
	return await getData<roomMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update room
export async function updateRoomRequest({
	roomId,
	inputUpdate
}: {
	roomId: number | string
	inputUpdate: updateRoomForm
}) {
	const resultFetch = await putData<roomMutaionResponse>({
		url: `http://localhost:4000/api/room/${roomId}`,
		body: inputUpdate,
	})
	return resultFetch
}
