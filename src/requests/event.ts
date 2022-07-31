import { createEventForm, updateEventForm } from 'type/form/basicFormType'
import { eventMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createEventRequest(inputCreate: createEventForm) {
	const resultFetch = await postData<eventMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail event
export const detailEventRequest = async (url: string) => {
	return await getData<eventMutationResponse>({
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
	const resultFetch = await putData<eventMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all events
export const allEventsRequest = async (url: string) => {
	return await getData<eventMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}


//Handle to delete event
export const deleteEventRequest = async (id: string) => {
	return await deleteData<eventMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
	})
}