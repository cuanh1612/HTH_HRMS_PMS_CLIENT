import { createLocationsForm, updateLocationForm } from 'type/form/basicFormType'
import { locationMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create locations
export async function createLocationRequest(inputCreate: createLocationsForm) {
	const resultFetch = await postData<locationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/locations`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update locations
export async function updateLocationRequest(inputUpdate: updateLocationForm) {
	const resultFetch = await putData<locationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/locations/${inputUpdate.locationId}`,
		body: {
			name: inputUpdate.name,
		},
	})

	return resultFetch
}

//Function handle get all or get detail locations
export const getLocationRequest = async (url: string) => {
	return await getData<locationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete locations
export async function deleteLocationRequest(locationId: string | number) {
	const resultFetch = await deleteData<locationMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/locations/${locationId}`,
	})

	return resultFetch
}
