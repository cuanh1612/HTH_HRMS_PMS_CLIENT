import { getData } from "../utils/fetchData";

export const allUsersRequest = async (url: string) => {
  return await getData({
    url: `http://localhost:4000/api/${url}`,
  });
};
