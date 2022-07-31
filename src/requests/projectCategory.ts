import { createProjetCategoryForm } from 'type/form/basicFormType'
import { ProjectCategoryMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle get all project category
export const allProjectCategoryRequest = async (url: string) => {
	return await getData<ProjectCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle create project category
export async function createProjectCategoryRequest(inputCreate: createProjetCategoryForm) {
	const resultFetch = await postData<ProjectCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-categories`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle delete project category
export async function deleteProjectCategoryRequest(inputDelete: { projectCategoryId: number }) {
	const resultFetch = await deleteData<ProjectCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-categories/${inputDelete.projectCategoryId}`,
	})

	return resultFetch
}

//Function handle update project category
export async function updateProjectCategoryRequest({
	projectCategoryId,
	name,
}: {
	projectCategoryId: number
	name: string
}) {
	const resultFetch = await putData<ProjectCategoryMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/project-categories/${projectCategoryId}`,
		body: {
			name,
		},
	})

	return resultFetch
}
