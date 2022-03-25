import useMutation from "use-mutation";
import { loginRequest, registerRequest } from "../requests/authRequests";

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
