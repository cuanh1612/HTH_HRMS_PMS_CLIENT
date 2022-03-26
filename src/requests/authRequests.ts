import {
  loginForm,
  logoutForm,
  registerForm
} from "../type/formTypes.ts/authFormType";
import { authMutaionResponse } from "../type/mutationResponses";
import { postData } from "../utils/fetchData";

//-----------------------------------------------------------------
//Request Mutation
//-----------------------------------------------------------------

//Function handle fetch register
export async function registerRequest(inputRegister: registerForm) {
  const resultFetch = await postData<authMutaionResponse>({
    url: "http://localhost:4000/api/auth/register",
    body: inputRegister,
  });

  return resultFetch;
}

//Function handle fetch login
export async function loginRequest(inputLogin: loginForm) {
  const resultFetch = await postData<authMutaionResponse>({
    url: "http://localhost:4000/api/auth/login",
    body: inputLogin,
  });

  return resultFetch;
}

//Function handle fetch logout
export async function logoutRequest(inputLogout: logoutForm) {
  const resultFetch = await postData<authMutaionResponse>({
    url: "http://localhost:4000/api/auth/logout",
    body: inputLogout,
  });

  return resultFetch;
}

//-----------------------------------------------------------------
//Request for queries
//-----------------------------------------------------------------
