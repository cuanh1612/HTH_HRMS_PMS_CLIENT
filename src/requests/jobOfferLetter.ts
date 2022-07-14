import {
	createJobOfferLetterForm, deleteJobOfferLettersForm,
	updateJobOfferLetterForm
} from 'type/form/basicFormType'
import { jobOfferLetterMutationResponse } from 'type/mutationResponses'
import { deleteData, getData, postData, putData } from 'utils/fetchData'

//Function handle create job offer letter
export async function createJobOfferLetterRequest(inputCreate: createJobOfferLetterForm) {
	const resultFetch = await postData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters`,
		body: inputCreate,
	})

	return resultFetch
}

//Function handle update job offer
export async function updateJobOfferRequest(inputUpdate: updateJobOfferLetterForm) {
	const resultFetch = await putData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters/${inputUpdate.jobOfferLetterId}`,
		body: inputUpdate,
	})

	return resultFetch
}

//Function handle get all or detail job offer
export const getJobOfferRequest = async (url: string) => {
	return await getData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle delete job offers
export async function deleteJobOfferRequest(jobOfferId: string | number) {
	const resultFetch = await deleteData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters/${jobOfferId}`,
	})

	return resultFetch
}

//Function handle delete many job offers
export async function deleteManyJobOffersRequest(inputDelete: deleteJobOfferLettersForm) {
	const resultFetch = await postData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters/delete-many`,
		body: inputDelete,
	})

	return resultFetch
}

//get public job offer letter to sign
export async function  publicJobOfferLetterRequest(token: string | number) {

	const resultFetch = await getData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters/public/${token}`,
	})

	return resultFetch
}

//Function handle update status
export async function updateOfferLetterStatusRequest({id, status}: {id?: number | null, status: string}) {
	const resultFetch = await putData<jobOfferLetterMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters/status/${id}`,
		body: {
			status
		},
	})

	return resultFetch
}
