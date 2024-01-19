import "../styles/globals.css";
import "@fontsource/comic-neue";
import type { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import theme from "../styles/theme";
import Head from "next/head";
import {
  KoinosAccountProvider,
  // @ts-ignore
} from "react-koinos-toolkit";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <KoinosAccountProvider
        defaultRpcUrl={process.env.NEXT_PUBLIC_KOINOS_RPC_URL}
        kapNameServiceAddress={process.env.NEXT_PUBLIC_NAME_SERVICE_ADDR}
        kapProfileAddress={process.env.NEXT_PUBLIC_PROFILE_ADDR}
      >
        <ChakraProvider theme={theme}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0"
            />
          </Head>
          <Flex
            padding={{ base: 4, md: 8 }}
            gap={{ base: 4, md: 8 }}
            margin="auto"
            maxWidth="1024px"
            minHeight="100%"
            direction="column"
          >
            <Header />
            <main style={{ flex: 1, display: "flex" }}>
              <Component {...pageProps} />
            </main>
          </Flex>
        </ChakraProvider>
      </KoinosAccountProvider>
    </>
  );
}

export default MyApp;
