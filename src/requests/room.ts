import { createRoomForm, updateRoomForm } from 'type/form/basicFormType'
import { roomMutationResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createRoomRequest(inputCreate: createRoomForm) {
	const resultFetch = await postData<roomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail 
export const detailRoomRequest = async (url: string) => {
	return await getData<roomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
	const resultFetch = await putData<roomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${roomId}`,
		body: inputUpdate,
	})
	return resultFetch
}
