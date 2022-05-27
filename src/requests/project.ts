import { createProjectForm, updateProjectForm, EmployeesNotInProjectForm, EmployeesByDepartmentProjectForm, updateStatusProjectForm } from 'type/form/basicFormType'
import { employeeMutaionResponse, projectMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create
export async function createProjectRequest(inputCreate: createProjectForm) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: 'http://localhost:4000/api/projects',
		body: inputCreate,
	})

	return resultFetch
}

//Function handle get detail project
export const detailProjectRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Function handle get employees not in project
export const employeesNotInProjectRequest = async (url: string) => {
	return await getData<employeeMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
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
		url: `http://localhost:4000/api/projects/assign-employee/${projectId}`,
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
		url: `http://localhost:4000/api/projects/assign-employee/department/${projectId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all employees in project
export const allEmployeesInProjectRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `http://localhost:4000/api/projects/${url}`,
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
		url: `http://localhost:4000/api/projects/${projectId}`,
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
		url: `http://localhost:4000/api/projects/${projectId}/change-status`,
		body: inputUpdate,
	})

	return resultFetch
}

// get all
export const allProjectsRequest = async (url: string) => {
	return await getData<projectMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

// Handle to delete many holidays
export const deleteProjectsRequest = async (ids: number[]) => {
	return await postData<projectMutaionResponse>({
		url: `http://localhost:4000/api/projects/delete-many`,
		body: {
			projects: ids,
		},
	})
}

//Handle to delete holiday
export const deleteProjectRequest = async (id: string | number) => {
	return await deleteData<projectMutaionResponse>({
		url: `http://localhost:4000/api/projects/${id}`,
	})
}

// change project admin
export async function setProjectAdminRequest(data : {
	idProject?: string | string [] , idEmployee: number
}) {
	const resultFetch = await postData<projectMutaionResponse>({
		url: 'http://localhost:4000/api/projects/project-admin',
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
		url: 'http://localhost:4000/api/projects/delete-employee',
		body: inputCreate,
	})

	return resultFetch
}


