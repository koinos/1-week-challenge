import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import useTimer from "../utils/useTimer";

interface CircleTimerProps {
  seconds?: number;
  onTimerEnd: () => void;
}

export default function CircleTimer({
  seconds = 10,
  onTimerEnd,
}: CircleTimerProps) {
  const counter = useTimer(seconds, onTimerEnd);

  return (
    <CircularProgress max={seconds} value={counter}>
      <CircularProgressLabel>{counter}</CircularProgressLabel>
    </CircularProgress>
  );
}
