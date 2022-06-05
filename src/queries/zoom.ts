import { AxiosError } from 'axios'
import useSWR from 'swr'
import { allUsersRequest } from 'requests/user'
import { roomMutaionResponse } from 'type/mutationResponses'

export const allRoomsQuery = ({
	isAuthenticated,
	role,
	id,
}: {
	isAuthenticated: boolean | null
	role?: string
	id?: number
}) => {
	var url = ''
	if (isAuthenticated) {
		url = 'rooms'
	}
	if (role && id) {
		switch (role) {
			case 'Employee':
                url += `?employee=${id}`
				break
			case 'Client':
                url += `?client=${id}`
				break
		}
	}
	return useSWR<roomMutaionResponse, AxiosError>(
		(isAuthenticated && role && id) ? url : null,
		allUsersRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}
