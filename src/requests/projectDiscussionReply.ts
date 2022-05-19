import { projectdiscussionReplyMutaionResponse } from 'type/mutationResponses'
import { getData } from 'utils/fetchData'

//Function handle get all reply of a discussion
export const allRepliesByDiscussionRequest = async (url: string) => {
	return await getData<projectdiscussionReplyMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}
