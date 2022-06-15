import { updateCompanyInfoForm } from 'type/form/basicFormType'
import { companyInfoMutationResponse } from 'type/mutationResponses'
import { getData, putData } from 'utils/fetchData'

export const contractInfoRequest = async (url: string) => {
	return await getData<companyInfoMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/${url}`,
	})
}

//Function handle update company info
export async function updateCompanyInfoRequest(inputUpdate: updateCompanyInfoForm) {
	const resultFetch = await putData<companyInfoMutationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/company-info`,
		body: inputUpdate,
	})

	return resultFetch
}
