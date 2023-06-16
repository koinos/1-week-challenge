import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import CircleTimer from "../components/CircleTimer";
import VoteBar from "../components/VoteBar";
import VoteButton from "../components/VoteButton";
import AnswerOverlay from "../components/AnswerOverlay";
import { useRouter } from "next/router";
import {
  useAccount,
  // @ts-ignore
} from "react-koinos-toolkit";
import { joinGame, submitAnswer, useActiveGames } from "../utils/useSupabase";

const Play: NextPage = () => {
  const {
    query: { gameId },
  } = useRouter();
  const { address } = useAccount();
  const [isPlaying, setIsPlaying] = useState(false);
  const [answer, setAnswer] = useState<boolean>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { fetching, error, data } = useActiveGames(gameId as string);

  useEffect(() => {
    if (address && gameId) {
      joinGame(address, gameId as string).then((result) => {
        console.log({ action: "join", address, gameId, result });
        setIsPlaying(true);
      });
    }
  }, [address, gameId]);

  function submit(answer: boolean) {
    return submitAnswer(address, gameId as string, answer).then((result) => {
      console.log({ action: "submit", address, gameId, answer, result });
    });
  }

  if (fetching) return <Spinner />;

  if (data![0].ended) return <Text>Thanks for playing!</Text>;

  return (
    <>
      <Head>
        <title>Playing | Fact or Fiction</title>
      </Head>
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        direction="column"
        gap="16"
      >
        <Card align="center" width="100%">
          <CardHeader>
            {!showAnswer && (
              <CircleTimer onTimerEnd={() => setShowAnswer(true)} />
            )}
          </CardHeader>
          <CardBody>{data![0].question}</CardBody>
        </Card>
        <Flex width="100%" gap="8" flex="1" alignItems="flex-end">
          {isPlaying && typeof answer === "undefined" ? (
            <>
              <VoteButton isFactVote={true} onVote={() => submit(true)} />
              <VoteButton isFactVote={false} onVote={() => submit(false)} />
            </>
          ) : (
            <>
              <VoteBar
                isFactVote={true}
                numberOfPlayers={1000}
                numberOfVotes={85}
              />
              <VoteBar
                isFactVote={false}
                numberOfPlayers={1000}
                numberOfVotes={843}
              />
            </>
          )}
        </Flex>
        {showAnswer && (
          <AnswerOverlay
            isFact={data![0].answer}
            onClose={() => {
              setIsPlaying(
                isPlaying && data![0].answer === answer
              );
              setAnswer(undefined);
              setCurrentQuestion(currentQuestion + 1);
              setShowAnswer(false);
            }}
            realFactIfFiction={data![0].real_fact_if_fiction}
          />
        )}
      </Flex>
    </>
  );
};

export default Play;
