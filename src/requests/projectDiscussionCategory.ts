import { projectDisucssionCategoryMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all project discussion category
export const allProjectDiscussionCategoryRequest = async (url: string) => {
	return await getData<projectDisucssionCategoryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
