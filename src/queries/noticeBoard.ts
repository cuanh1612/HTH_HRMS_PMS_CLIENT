import { AxiosError } from 'axios'
import { allNoticeBoardRequest, detailNoticeBoardRequest } from 'requests/noticeBoard'
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

export const allNoticeBoardQuery = (
	isAuthenticated: boolean | null,
) => {
	return useSWR<NoticeBoardMutaionResponse, AxiosError>(
		isAuthenticated ? `notice-boards` : null,
		allNoticeBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const allNoticeBoardToQuery = (
	isAuthenticated: boolean | null,
	noticeTo?: string
) => {
	return useSWR<NoticeBoardMutaionResponse, AxiosError>(
		isAuthenticated && noticeTo ? `notice-boards/notice-to/${noticeTo}` : null,
		allNoticeBoardRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}