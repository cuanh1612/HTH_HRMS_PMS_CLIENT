import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import Layout from "./Layout";
import AuthContextProvider from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <AuthContextProvider>
        <>
          <Layout />
          <Component {...pageProps} />
        </>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
