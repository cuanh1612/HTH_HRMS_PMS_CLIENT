import { createEventForm, updateEventForm } from 'type/form/basicFormType'
import { eventMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createEventRequest(inputCreate: createEventForm) {
	const resultFetch = await postData<eventMutaionResponse>({
		url: 'http://localhost:4000/api/events',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail event
export const detailEventRequest = async (url: string) => {
	return await getData<eventMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update event
export async function updateEventRequest({
	inputUpdate,
	eventId,
}: {
	inputUpdate: updateEventForm
	eventId: number
}) {
	const resultFetch = await putData<eventMutaionResponse>({
		url: `http://localhost:4000/api/events/${eventId}`,
		body: inputUpdate,
	})

	return resultFetch
}