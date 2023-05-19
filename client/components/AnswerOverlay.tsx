import {
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Progress,
  Text,
} from "@chakra-ui/react";
import useTimer from "../utils/useTimer";

interface AnswerOverlayProps {
  seconds?: number;
  onClose: () => void;
  isFact: boolean;
  realFactIfFiction?: string;
}

export default function AnswerOverlay({
  seconds = 5,
  onClose,
  isFact,
  realFactIfFiction,
}: AnswerOverlayProps) {
  const counter = useTimer(seconds, onClose);

  return (
    <Card
      position="absolute"
      top="0"
      bottom="0"
      left="0"
      right="0"
      background={isFact ? "green.500" : "red.500"}
      borderRadius="0"
    >
      <CardBody>
        <Flex
          direction="column"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap="8"
        >
          {isFact ? (
            <Heading>
              👍
              <br />
              Fact
            </Heading>
          ) : (
            <>
              <Heading>
                👎
                <br />
                Fiction
              </Heading>
              <Text>{realFactIfFiction}</Text>
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter>
        <Progress
          value={counter}
          max={seconds}
          colorScheme="gray"
          width="100%"
        />
      </CardFooter>
    </Card>
  );
}
