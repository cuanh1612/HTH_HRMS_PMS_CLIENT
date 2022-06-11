import { createProjectFileForm } from 'type/form/basicFormType'
import { projectFileMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData } from 'utils/fetchData'

//Function handle create project file
export async function createProjectFileRequest(inputCreate: createProjectFileForm) {
	const resultFetch = await postData<projectFileMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-files`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete project file
export async function deleteProjectFileRequest(inputDelete: {
	projectFileId: number
	projectId: number
}) {
	const resultFetch = await deleteData<projectFileMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-files/${inputDelete.projectFileId}/project/${inputDelete.projectId}`,
	})

	return resultFetch
}

//Function handle get all project file
export const allProjectFilesRequest = async (url: string) => {
	return await getData<projectFileMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}
