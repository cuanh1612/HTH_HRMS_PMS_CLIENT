import Link from "next/link";
import * as React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { logoutServerMutation } from "../mutations/authMuatations";
import JWTManager from "../utils/jwt";

export interface ILayoutProps {}

export default function Layout() {
  const { isAuthenticated, logoutClient } = React.useContext(AuthContext);
  const [mutateLogoutServer, _] = logoutServerMutation();

  const logout = async () => {
    logoutClient();
    await mutateLogoutServer({
      userId: JWTManager.getUserId()?.toString() as string,
    });
  };

  return (
    <div>
      <nav
        style={{
          borderBottom: "1px solid",
          paddingBottom: "1rem",
        }}
      >
        <Link href={"/"}>
          <a>Home</a>
        </Link>
        |
        <Link href={"/login"}>
          <a>Login</a>
        </Link>
        |
        <Link href={"/register"}>
          <a>Register</a>
        </Link>
        |{isAuthenticated && <button onClick={logout}>Logout</button>}
      </nav>
    </div>
  );
}
