import Link from "next/link";
import * as React from "react";

export interface ILayoutProps {}

export default function Layout() {
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
      </nav>
    </div>
  );
}
