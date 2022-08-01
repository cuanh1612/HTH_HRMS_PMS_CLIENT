import { createProjectDiscussionRoomForm } from 'type/form/basicFormType'
import { ProjectDiscussionRoomMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle get all project discussion rooms
export const allProjectDiscussionRoomsRequest = async (url: string) => {
	return await getData<ProjectDiscussionRoomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create project discussion rooms
export async function createProjectDiscussionRoomRequest(inputCreate: createProjectDiscussionRoomForm) {
	const resultFetch = await postData<ProjectDiscussionRoomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-discussion-rooms`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete project discussion rooms
export async function deleteProjectDiscussionRoomRequest(inputDelete: { ProjectDiscussionRoomId: number }) {
	const resultFetch = await deleteData<ProjectDiscussionRoomMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-discussion-rooms/${inputDelete.ProjectDiscussionRoomId}`,
	})

	return resultFetch
}
