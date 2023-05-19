import type { NextPage } from "next";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fact or Fiction</title>
      </Head>
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="center"
        direction="column"
        gap="8"
      >
        <Link href="/play">Play</Link>
      </Flex>
    </>
  );
};

export default Home;
