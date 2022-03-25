import axios, { AxiosResponse } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { getData } from "./fetchData";

const JWTManager = () => {
  axios.defaults.withCredentials = true;
  let inMemoryToken: string | null = null;
  // let refreshTokenTimeoutId: number | null = null;

  const getToken = () => inMemoryToken;

  const setToken = (accessToken: string) => {
    inMemoryToken = accessToken;

    //Decode and set countdown to refresh
    const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken);

    setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number));
    return true;
  };

  const getRefreshToken = async () => {
    const response = await getData<{
      accessToken: string;
    }>({
      url: "http://localhost:4000/api/auth/refresh_token",
    });

    setToken(response.accessToken);
    return true;
  };

  const setRefreshTokenTimeout = (delay: number) => {
    //5s before token expires
    window.setTimeout(getRefreshToken, delay * 1000 - 5000);
  };

  return {
    getToken,
    setToken,
    getRefreshToken
  };
};

export default JWTManager();
