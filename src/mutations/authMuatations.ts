import useMutation from "use-mutation";
import { loginRequest, logoutRequest, registerRequest } from "../requests/authRequests";

export const registerMutation = () => {
  return useMutation(registerRequest, {
    onFailure({ error }) {
      console.log(error.message);
    },
  });
};

export const loginMutation = () => {
    return useMutation(loginRequest, {
      onFailure({ error }) {
        console.log(error.message);
      },
    });
  };


  export const logoutServerMutation = () => {
    return useMutation(logoutRequest, {
      onFailure({ error }) {
        console.log(error.message);
      },
    });
  };
