import { createHolidaysForm, updateHolidayForm } from 'type/form/basicFormType'
import { holidayMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create holidays
export async function createHolidaysRequest(inputCreate: createHolidaysForm) {
	const resultFetch = await postData<holidayMutaionResponse>({
		url: 'http://localhost:4000/api/holidays',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail holidays
export const detailHolidayRequest = async (url: string) => {
	return await getData<holidayMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

// get all
export const allHolidaysRequest = async (url: string) => {
	return await getData<holidayMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle update holiday
export async function updateHolidayRequest({
	inputUpdate,
	holidayId,
}: {
	inputUpdate: updateHolidayForm
	holidayId: number | string
}) {
	const resultFetch = await putData<holidayMutaionResponse>({
		url: `http://localhost:4000/api/holidays/${holidayId}`,
		body: inputUpdate,
	})

	return resultFetch
}

// Handle to delete many holidays
export const deleteHolidaysRequest = async (ids: number[]) => {
	return await postData<holidayMutaionResponse>({
		url: `http://localhost:4000/api/holidays/delete-many`,
		body: {
			holidays: ids,
		},
	})
}

//Handle to delete holiday
export const deleteHolidayRequest = async (id: string | number) => {
	return await deleteData<holidayMutaionResponse>({
		url: `http://localhost:4000/api/holidays/${id}`,
	})
}

