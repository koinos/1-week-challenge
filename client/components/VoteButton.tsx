import { Button, Text } from "@chakra-ui/react";

interface VoteButtonProps {
  isFactVote: boolean;
  onVote: () => void;
}

export default function VoteButton({ isFactVote, onVote }: VoteButtonProps) {
  return (
    <Button
      height="10em"
      flex="1"
      onClick={onVote}
      background={isFactVote ? "green.500" : "red.500"}
      _hover={{ background: isFactVote ? "green.400" : "red.400" }}
      color="white"
    >
      {isFactVote ? (
        <Text>
          👍
          <br />
          Fact
        </Text>
      ) : (
        <Text>
          👎
          <br />
          Fiction
        </Text>
      )}
    </Button>
  );
}
