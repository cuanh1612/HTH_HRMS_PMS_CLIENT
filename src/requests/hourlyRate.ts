import { commonResponse } from 'type/mutationResponses'
import { putData } from 'utils/fetchData'

//Function handle update holiday
export async function updatehourlyRateRequest(inputUpdate: {
	idProject?: string | number
	idEmployee?: number
	hourly_rate?: number
}) {
	const resultFetch = await putData<commonResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/hourly-Rate`,
		body: inputUpdate,
	})

	return resultFetch
}
