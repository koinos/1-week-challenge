import type { NextPage } from "next";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useGames } from "../utils/useSupabase";
import Countdown from "react-countdown";
import {
  useAccount,
  // @ts-ignore
} from "react-koinos-toolkit";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { fetching, error, data } = useGames();

  const upcomingGames = data?.filter((item: any) => !item.ended);

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
        {fetching ? (
          <Spinner />
        ) : error ? (
          <Text>{error}</Text>
        ) : upcomingGames?.length ? (
          <SimpleGrid width="100%" gap="4" columns={{ base: 1, md: 2 }}>
            {upcomingGames.map((item: any) => {
              const isStarted = item.start_at <= Date.now();
              return (
                <Card key={item.id}>
                  <CardHeader>
                    {isStarted ? (
                      <Heading>Game in progress</Heading>
                    ) : (
                      <Heading>
                        Game starting in{" "}
                        <Countdown
                          date={item.start_at}
                          renderer={({ minutes, seconds }) => (
                            <>
                              {minutes}:{seconds.toString().padStart(2, "00")}
                            </>
                          )}
                        />
                      </Heading>
                    )}
                  </CardHeader>
                  <CardBody>
                    {isStarted ? (
                      <Text>{item.players_remaining} players remaining</Text>
                    ) : (
                      <Text>{item.participant_count} ready to play</Text>
                    )}
                  </CardBody>
                  <CardFooter>
                    <Link href={`/play?gameId=${item.id}`}>
                      {isStarted ? (
                        <Button colorScheme="gray" width="100%">
                          Watch
                        </Button>
                      ) : address ? (
                        <Button colorScheme="blue" width="100%">
                          Play
                        </Button>
                      ) : (
                        <Button isDisabled width="100%">Connect Wallet to Play</Button>
                      )}
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        ) : (
          <Text>No upcoming games</Text>
        )}
      </Flex>
    </>
  );
};

export default Home;
