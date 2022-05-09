import { createEventForm } from 'type/form/basicFormType'
import { eventMutaionResponse } from 'type/mutationResponses'
import { postData } from 'utils/fetchData'

//Function handle create
export async function createEventRequest(inputCreate: createEventForm) {
	const resultFetch = await postData<eventMutaionResponse>({
		url: 'http://localhost:4000/api/events',
		body: inputCreate,
	})

	return resultFetch
}
