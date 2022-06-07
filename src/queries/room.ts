import { AxiosError } from 'axios'
import { detailRoomRequest } from 'requests/room'
import useSWR from 'swr'
import { roomMutaionResponse } from 'type/mutationResponses'

export const detailRoomQuery = (
	isAuthenticated: boolean | null,
	roomId: string | number | null | undefined
) => {
	return useSWR<roomMutaionResponse, AxiosError>(
		isAuthenticated && roomId ? `rooms/${roomId}` : null,
		detailRoomRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}

export const getRoomByTitleQuery = (
	isAuthenticated: boolean | null,
	title?: string | string[]
) => {
	return useSWR<roomMutaionResponse, AxiosError>(
		isAuthenticated && title ? `rooms/title/${title}` : null,
		detailRoomRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
