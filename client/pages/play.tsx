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
import { joinGame, submitAnswer, useGame } from "../utils/useSupabase";
import Countdown from "react-countdown";

const Play: NextPage = () => {
  const {
    query: { gameId },
  } = useRouter();
  const { address } = useAccount();
  const [submittedAnswer, setSubmittedAnswer] = useState<boolean>();
  const [isRight, setIsRight] = useState<boolean>();
  const [showAnswer, setShowAnswer] = useState(false);
  const [joined, setJoined] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { fetching, error, playerGame, activeGame } = useGame(
    address,
    gameId as string
  );

  useEffect(() => {
    if (
      !joined &&
      !fetching &&
      activeGame &&
      activeGame.start_at > Date.now() &&
      address &&
      gameId
    ) {
      joinGame(address, gameId as string).then(() => setJoined(true));
    }
  }, [joined, fetching, activeGame, address, gameId]);

  function submit(answer: boolean) {
    if (!playerGame.eliminated && address && gameId) {
      return submitAnswer(address, gameId as string, answer).then((result) => {
        setSubmittedAnswer(answer);
        setIsRight(result);
      });
    }
  }

  if (fetching) return <Spinner />;

  if (!activeGame) return <Text>Game not found</Text>;

  if (!playerGame) return <Text>Joining game...</Text>;

  if (activeGame.start_at > Date.now())
    return (
      <Stack>
        <Heading>
          Game starting in{" "}
          <Countdown
            date={activeGame.start_at}
            renderer={({ minutes, seconds }) => (
              <>
                {minutes}:{seconds.toString().padStart(2, "00")}
              </>
            )}
          />
        </Heading>
        <Text>{activeGame.participant_count} players are waiting</Text>
      </Stack>
    );

  if (gameOver)
    return playerGame.eliminated ? (
      <Text>Better luck next time!</Text>
    ) : (
      <Text>You won {playerGame.rewards}!</Text>
    );

  return (
    <>
      <Head>
        <title>
          {!joined
            ? "Watching"
            : playerGame.rewards
            ? "Winner"
            : playerGame.eliminated
            ? "Loser"
            : "Playing"}{" "}
          | Fact or Fiction
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
          <CardBody>{activeGame.question}</CardBody>
        </Card>
        <Flex width="100%" gap="8" flex="1" alignItems="flex-end">
          {!playerGame.eliminated &&
          !playerGame.rewards &&
          typeof submittedAnswer === "undefined" ? (
            <>
              <VoteButton isFactVote={true} onVote={() => submit(true)} />
              <VoteButton isFactVote={false} onVote={() => submit(false)} />
            </>
          ) : (
            <>
              <VoteBar
                isFactVote={true}
                numberOfPlayers={activeGame.players_remaining}
                numberOfVotes={
                  submittedAnswer === isRight
                    ? activeGame.right_count
                    : activeGame.wrong_count
                }
              />
              <VoteBar
                isFactVote={false}
                numberOfPlayers={activeGame.players_remaining}
                numberOfVotes={
                  submittedAnswer !== isRight
                    ? activeGame.right_count
                    : activeGame.wrong_count
                }
              />
            </>
          )}
        </Flex>
        {showAnswer && (
          <AnswerOverlay
            isFact={submittedAnswer === isRight}
            onClose={() => {
              setSubmittedAnswer(undefined);
              setIsRight(undefined);
              setShowAnswer(false);
              if (playerGame.eliminated || playerGame.rewards) {
                setGameOver(true);
              }
            }}
            realFactIfFiction={activeGame.real_fact_if_fiction}
          />
        )}
      </Flex>
    </>
  );
};

export default Play;
