import * as React from "react";
import { loginMutation } from "../mutations/authMuatations";
import JWTManager from "../utils/jwt";

export interface ILoginProps {}

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [mutate, { status, data }] = loginMutation();

  React.useEffect(() => {
    switch (status) {
      case "running":
        console.log("loading");
        break;

      case "success":
        JWTManager.setToken(data?.accessToken as string)
        console.log("stop loading");
        break;

      default:
        console.log("stop loading");
        break;
    }
  }, [status]);

  const onLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      email,
      password,
    });
  };

  return (
    <div>
      <form
        onSubmit={onLogin}
        style={{
          marginTop: "1rem",
        }}
      >
        <input
          name="email"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
