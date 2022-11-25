import { sendMailContactForm } from "type/form/basicFormType"
import { SendEmailContactResponse } from "type/mutationResponses"
import { postData } from "utils/fetchData"

//Function handle help user send mail contact
export async function sendMailContactRequest(inputCreate: sendMailContactForm) {
	const resultFetch = await postData<SendEmailContactResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
		body: inputCreate,
	})

	return resultFetch
}