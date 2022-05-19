import { createProjectDiscussionCategoryForm } from 'type/form/basicFormType'
import { projectDisucssionCategoryMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all project discussion category
export const allProjectDiscussionCategoryRequest = async (url: string) => {
	return await getData<projectDisucssionCategoryMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle create project discussion category
export async function createProjecrtDiscussionCategoryRequest(inputCreate: createProjectDiscussionCategoryForm) {
	const resultFetch = await postData<projectDisucssionCategoryMutaionResponse>({
		url: 'http://localhost:4000/api/project-discussion-categories',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete project discussion category
export async function deleteProjecrtDiscussionCategoryRequest(inputDelete: { projectDiscussionCategoryId: number }) {
	const resultFetch = await deleteData<projectDisucssionCategoryMutaionResponse>({
		url: `http://localhost:4000/api/project-discussion-categories/${inputDelete.projectDiscussionCategoryId}`,
	})

	return resultFetch
}

//Function handle update project discussion category
export async function updateProjectDiscussionCategoryRequest({
	projectDiscussionCategoryId,
	name,
	color
}: {
	projectDiscussionCategoryId: number
	name: string,
	color: string
}) {
	const resultFetch = await putData<projectDisucssionCategoryMutaionResponse>({
		url: `http://localhost:4000/api/project-discussion-categories/${projectDiscussionCategoryId}`,
		body: {
			name,
			color
		},
	})

	return resultFetch
}
