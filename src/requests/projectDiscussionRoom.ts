import { createLeaveTypeForm, createProjectDiscussionRoomForm } from 'type/form/basicFormType'
import { ProjectDisucssionRoomMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle get all project discussion rooms
export const allProjectDiscussionRoomsRequest = async (url: string) => {
	return await getData<ProjectDisucssionRoomMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create project discussion rooms
export async function createProjectDiscussionRoomRequest(inputCreate: createProjectDiscussionRoomForm) {
	const resultFetch = await postData<ProjectDisucssionRoomMutaionResponse>({
		url: 'http://localhost:4000/api/project-discussion-rooms',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete project discussion rooms
export async function deleteProjectDiscussionRoomRequest(inputDelete: { ProjectDiscussionRoomId: number }) {
	const resultFetch = await deleteData<ProjectDisucssionRoomMutaionResponse>({
		url: `http://localhost:4000/api/project-discussion-rooms/${inputDelete.ProjectDiscussionRoomId}`,
	})

	return resultFetch
}
