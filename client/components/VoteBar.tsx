import { Card, CardHeader } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface VoteBarProps {
  isFactVote: boolean;
  numberOfVotes?: number;
  numberOfPlayers?: number;
}

export default function VoteBar({
  isFactVote,
  numberOfVotes = 0,
  numberOfPlayers = 0,
}: VoteBarProps) {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <Card
      textAlign="center"
      height={rendered ? `${(numberOfVotes / numberOfPlayers) * 100}%` : "0"}
      minHeight="1em"
      flex="1"
      background={isFactVote ? "green.500" : "red.500"}
      transition="height 0.25s ease-in-out"
    >
      <CardHeader marginTop="-3em">{numberOfVotes}</CardHeader>
    </Card>
  );
}
