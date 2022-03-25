import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { allUsersQuery } from "../queries/userQueries";

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
  const [loading, setLoading] = useState(true);
  const { checkAuth, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      setLoading(false);
    };

    authenticate();
  }, []);

  const { data, error } = allUsersQuery(isAuthenticated);

  if (loading) return <h1>Loading ...</h1>;

  if (error) return <div>{JSON.stringify(error.response?.data.message)}</div>;

  return (
    <>
      <div>Home Page</div>
      <div>{data && JSON.stringify(data?.users)}</div>
    </>
  );
}
