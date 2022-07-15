import { projectActivityMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all activity by project
export const allActivityByProjectRequest = async (url: string) => {
	return await getData<projectActivityMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
