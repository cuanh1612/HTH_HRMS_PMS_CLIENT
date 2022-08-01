import { AxiosError } from 'axios'
import {
	allRepliesByDiscussionRequest,
	detailDiscussionReplyRequest,
} from 'requests/projectDiscussionReply'
import useSWR from 'swr'
import { projectDiscussionReplyMutationResponse } from 'type/mutationResponses'

export const allRepliesByDiscussionQuery = (
	isAuthenticated: boolean | null,
	projectDiscussionId?: number | string
) => {
	return useSWR<projectDiscussionReplyMutationResponse, AxiosError>(
		isAuthenticated && projectDiscussionId
			? `project-discussion-replies/project-discussion-room/${projectDiscussionId}`
			: null,
		allRepliesByDiscussionRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const detailDiscussionReplyQuery = (
	isAuthenticated: boolean | null,
	discussionReplyId?: number | string
) => {
	return useSWR<projectDiscussionReplyMutationResponse, AxiosError>(
		isAuthenticated && discussionReplyId
			? `project-discussion-replies/${discussionReplyId}`
			: null,
		detailDiscussionReplyRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
