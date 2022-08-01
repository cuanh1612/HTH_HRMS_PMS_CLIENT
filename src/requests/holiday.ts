import { createHolidaysForm, updateHolidayForm } from 'type/form/basicFormType'
import { holidayMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create holidays
export async function createHolidaysRequest(inputCreate: createHolidaysForm) {
	const resultFetch = await postData<holidayMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/holidays`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail holidays
export const detailHolidayRequest = async (url: string) => {
	return await getData<holidayMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all
export const allHolidaysRequest = async (url: string) => {
	return await getData<holidayMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
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
	const resultFetch = await putData<holidayMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/holidays/${holidayId}`,
		body: inputUpdate,
	})

	return resultFetch
}

// Handle to delete many holidays
export const deleteHolidaysRequest = async (ids: number[]) => {
	return await postData<holidayMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/holidays/delete-many`,
		body: {
			holidays: ids,
		},
	})
}

//Handle to delete holiday
export const deleteHolidayRequest = async (id: string | number) => {
	return await deleteData<holidayMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/holidays/${id}`,
	})
}

