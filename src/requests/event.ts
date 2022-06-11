import { createEventForm, updateEventForm } from 'type/form/basicFormType'
import { eventMutaionResponse } from 'type/mutationResponses'
import { getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createEventRequest(inputCreate: createEventForm) {
	const resultFetch = await postData<eventMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail event
export const detailEventRequest = async (url: string) => {
	return await getData<eventMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all events
export const allEventsRequest = async (url: string) => {
	return await getData<eventMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
