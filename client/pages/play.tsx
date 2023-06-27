import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Stack,
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
import {
  joinGame,
  submitAnswer,
  useActiveGames,
  usePlayerGames,
} from "../utils/useSupabase";
import Countdown from "react-countdown";

const Play: NextPage = () => {
  const {
    query: { gameId },
  } = useRouter();
  const { address } = useAccount();
  const [submittedAnswer, setSubmittedAnswer] = useState<boolean>();
  const [isRight, setIsRight] = useState<boolean>();
  const [showAnswer, setShowAnswer] = useState(false);

  const activeGame = useActiveGames(gameId as string);
  const playerGame = usePlayerGames(address, gameId as string);

  useEffect(() => {
    if (
      !activeGame.fetching &&
      activeGame.data &&
      activeGame.data[0].start_at > Date.now() &&
      address &&
      gameId
    ) {
      joinGame(address, gameId as string);
    }
  }, [activeGame.fetching, activeGame.data, address, gameId]);

  function submit(answer: boolean) {
    if (!playerGame.data.eliminated && address && gameId) {
      return submitAnswer(address, gameId as string, answer).then((result) => {
        setSubmittedAnswer(answer);
        setIsRight(result);
      });
    }
  }

  if (activeGame.fetching || playerGame.fetching) return <Spinner />;
  if (!activeGame.data || !playerGame.data)
    return <Text>Failed to fetch data</Text>;

  if (activeGame.data[0].start_at > Date.now())
    return (
      <Stack>
        <Heading>
          Game starting in{" "}
          <Countdown
            date={activeGame.data[0].start_at}
            renderer={({ minutes, seconds }) => (
              <>
                {minutes}:{seconds.toString().padStart(2, "00")}
              </>
            )}
          />
        </Heading>
        <Text>{activeGame.data[0].participant_count} players are waiting</Text>
      </Stack>
    );
  if (playerGame.data.eliminated) return <Text>Thanks for playing!</Text>;

  return (
    <>
      <Head>
        <title>
          {!playerGame.data.eliminated ? "Playing" : "Watching"} | Fact or
          Fiction
        </title>
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
          <CardBody>{activeGame.data[0].question}</CardBody>
        </Card>
        <Flex width="100%" gap="8" flex="1" alignItems="flex-end">
          {!playerGame.data.eliminated &&
          typeof submittedAnswer === "undefined" ? (
            <>
              <VoteButton isFactVote={true} onVote={() => submit(true)} />
              <VoteButton isFactVote={false} onVote={() => submit(false)} />
            </>
          ) : (
            <>
              <VoteBar
                isFactVote={true}
                numberOfPlayers={activeGame.data[0].players_remaining}
                numberOfVotes={
                  submittedAnswer === isRight
                    ? activeGame.data[0].right_count
                    : activeGame.data[0].wrong_count
                }
              />
              <VoteBar
                isFactVote={false}
                numberOfPlayers={activeGame.data[0].players_remaining}
                numberOfVotes={
                  submittedAnswer !== isRight
                    ? activeGame.data[0].right_count
                    : activeGame.data[0].wrong_count
                }
              />
            </>
          )}
        </Flex>
        {showAnswer && (
          <AnswerOverlay
            isFact={activeGame.data[0].answer}
            onClose={() => {
              setSubmittedAnswer(undefined);
              setIsRight(undefined);
              setShowAnswer(false);
            }}
            realFactIfFiction={activeGame.data[0].real_fact_if_fiction}
          />
        )}
      </Flex>
    </>
  );
};

export default Play;
