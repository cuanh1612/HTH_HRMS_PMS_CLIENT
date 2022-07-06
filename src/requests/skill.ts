import { createSkillsForm, deleteSkillsForm, updateSkillsForm } from 'type/form/basicFormType'
import { skillMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create skills
export async function createSkillsRequest(inputCreate: createSkillsForm) {
	const resultFetch = await postData<skillMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/skills`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update skills
export async function updateSkillRequest(inputUpdate: updateSkillsForm) {
	const resultFetch = await putData<skillMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${inputUpdate.skillId}`,
		body: {
			name: inputUpdate.name,
		},
	})

	return resultFetch
}

//Function handle get all skills
export const getSkillRequest = async (url: string) => {
	return await getData<skillMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete skills
export async function deleteSkillRequest(skillId: string | number | null) {
	const resultFetch = await deleteData<skillMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${skillId}`,
	})

	return resultFetch
}

//Function handle delete many skills
export async function deleteManySkillsRequest(inputDelete: deleteSkillsForm) {
	const resultFetch = await postData<skillMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/skills/delete-many`,
		body: inputDelete,
	})

	return resultFetch
}
