import { commonResponse } from 'type/mutationResponses'
import { putData } from 'utils/fetchData'

//Function handle update holiday
export async function updatehourlyRateRequest(inputUpdate: {
	idProject?: string | number
	idEmployee?: number
	hourly_rate?: number
}) {
	const resultFetch = await putData<commonResponse>({
		url: `http://localhost:4000/api/hourly-Rate`,
		body: inputUpdate,
	})

	return resultFetch
}
