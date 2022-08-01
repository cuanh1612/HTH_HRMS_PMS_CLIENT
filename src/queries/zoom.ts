import { AxiosError } from 'axios'
import useSWR from 'swr'
import { allUsersRequest } from 'requests/user'
import { roomMutationResponse } from 'type/mutationResponses'

export const allRoomsQuery = (input: {
	isAuthenticated: boolean | null
	role?: string
	id?: number
	month?: number| string
	year?: number| string
}) => {
	const fieldUrl: string[] = []
	input?.month && fieldUrl.push(`month=${input.month}`)
	input?.year && fieldUrl.push(`year=${input.year}`)

	var url = 'rooms'
	if (input.role && input.id) {
		switch (input.role) {
			case 'Employee':
				fieldUrl.push(`employee=${input.id}`)
              
				break
			case 'Client':
				fieldUrl.push(`client=${input.id}`)
				break
		}
	}

	for (let index = 0; index < fieldUrl.length; index++) {
		if (index == 0) {
			url += `?${fieldUrl[index]}`
		} else {
			url += `&${fieldUrl[index]}`
		}
	}

	return useSWR<roomMutationResponse, AxiosError>(
		input.isAuthenticated ? url : null,
		allUsersRequest,
		{
			errorRetryCount: 2,
			revalidateOnFocus: false,
		}
	)
}