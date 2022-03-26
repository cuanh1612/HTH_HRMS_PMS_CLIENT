import * as React from "react";
import { registerMutation } from "../mutations/authMuatations";

export interface IRegisterProps {}

export default function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setusername] = React.useState("");

  const [mutate, { status }] = registerMutation();
  React.useEffect(() => {
    switch (status) {
      case "running":
        console.log('loading');
        break;
      default:
        console.log('stop loading');
    }
  }, [status])

  const handleRegiser: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    mutate({
      email,
      username,
      password,
    });
  };

  return (
    <div>
      <form
        style={{
          marginTop: "1rem",
        }}
        onSubmit={handleRegiser}
      >
        <input
          name="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
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
