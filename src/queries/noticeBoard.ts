import { AxiosError } from 'axios'
import { detailNoticeBoardRequest } from 'requests/noticeBoard'
import useSWR from 'swr'
import { NoticeBoardMutaionResponse } from 'type/mutationResponses'

export const detailNoticeBoardQuery = (
	isAuthenticated: boolean | null,
	noticeBoardId: string | number | null | undefined
) => {
	return useSWR<NoticeBoardMutaionResponse, AxiosError>(
		isAuthenticated && noticeBoardId ? `notice-boards/${noticeBoardId}` : null,
		detailNoticeBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
