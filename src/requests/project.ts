import { createProjectForm, updateProjectForm, EmployeesNotInProjectForm, EmployeesByDepartmentProjectForm, updateStatusProjectForm } from 'type/form/basicFormType'
import { employeeMutaionResponse, projectMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createProjectRequest(inputCreate: createProjectForm) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail project
export const detailProjectRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle get employees not in project
export const employeesNotInProjectRequest = async (url: string) => {
	return await getData<employeeMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle assign employee
export async function assignEmployeeRequest({
	inputUpdate,
	projectId,
}: {
	inputUpdate: EmployeesNotInProjectForm
	projectId?: string | string[] | number 
}) {
	const resultFetch = await putData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/assign-employee/${projectId}`,
		body: inputUpdate,
	})

	return resultFetch
}


//Function handle update project
export async function assignEmplByDepartmentRequest({
	inputUpdate,
	projectId,
}: {
	inputUpdate: EmployeesByDepartmentProjectForm
	projectId?: string | string[] | number 
}) {
	const resultFetch = await putData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/assign-employee/department/${projectId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all employees in project
export const allEmployeesInProjectRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${url}`,
	})
}

//Function handle update project
export async function updateProjectRequest({
	inputUpdate,
	projectId,
}: {
	inputUpdate: updateProjectForm
	projectId: number
}) {
	const resultFetch = await putData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle update status project
export async function updateStatusProjectRequest({
	inputUpdate,
	projectId,
}: {
	inputUpdate: updateStatusProjectForm
	projectId: number | string
}) {
	const resultFetch = await putData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/change-status`,
		body: inputUpdate,
	})

	return resultFetch
}

// get all project with info employee and client in project
export const allProjectsRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all project normal by employee
export const allProjectsByEmployeeNormalRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all project by employee
export const allProjectsByEmployeeRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// get all project 
export const allProjectsNormalRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

// Handle to delete many 
export const deleteProjectsRequest = async (ids: number[]) => {
	return await postData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete-many`,
		body: {
			projects: ids,
		},
	})
}

//Handle to delete 
export const deleteProjectRequest = async (id: string | number) => {
	return await deleteData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`,
	})
}

// change project admin
export async function setProjectAdminRequest(data : {
	idProject?: string | string [] , idEmployee: number
}) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/project-admin`,
		body: data
	})

	return resultFetch
}

//Function handle delete employee in project
export async function deleteEmpInProjectRequest(inputCreate: {
	projectId?: string | string [],
	employeeId?: number
}) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete-employee`,
		body: inputCreate,
	})

	return resultFetch
}


