import { commonResponse} from "type/mutationResponses"
import { getData } from "utils/fetchData"


export const getDataDashBoardJobsRequest = async (url: string) => {
	return await getData<commonResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard-jobs/${url}`,
	})
}