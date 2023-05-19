import { useState } from "react";
import type { NextPage } from "next";
import { Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import CircleTimer from "../components/CircleTimer";
import VoteBar from "../components/VoteBar";
import VoteButton from "../components/VoteButton";
import AnswerOverlay from "../components/AnswerOverlay";

const QANDA = [
  {
    prompt: "Abraham Lincoln was the 12th president of the United States",
    isFact: false,
    realFactIfFiction: "Lincoln was the 16th president",
  },
  {
    prompt: 'The brand name Spam is a combination of "spice" and "ham"',
    isFact: true,
  },
  {
    prompt: "Walt Disney's Snow White was the first animated feature film",
    isFact: false,
    realFactIfFiction:
      "El Apóstol was a 70 minute political satire cartoon made in Argentina in 1917, 20 years before Snow White",
  },
  {
    prompt: "Q is the only letter that doesn't appear in any U.S. state name",
    isFact: true,
  },
  {
    prompt: "Sudan has more pyramids than any country in the world",
    isFact: true,
  },
];

const Play: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [answer, setAnswer] = useState<boolean>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!QANDA[currentQuestion]) return <Text>Thanks for playing!</Text>;

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
          <CardBody>{QANDA[currentQuestion].prompt}</CardBody>
        </Card>
        <Flex width="100%" gap="8" flex="1" alignItems="flex-end">
          {isPlaying && typeof answer === "undefined" ? (
            <>
              <VoteButton isFactVote={true} onVote={() => setAnswer(true)} />
              <VoteButton isFactVote={false} onVote={() => setAnswer(false)} />
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
            isFact={QANDA[currentQuestion].isFact}
            onClose={() => {
              setIsPlaying(
                isPlaying && QANDA[currentQuestion].isFact === answer
              );
              setAnswer(undefined);
              setCurrentQuestion(currentQuestion + 1);
              setShowAnswer(false);
            }}
            realFactIfFiction={QANDA[currentQuestion].realFactIfFiction}
          />
        )}
      </Flex>
    </>
  );
};

export default Play;
