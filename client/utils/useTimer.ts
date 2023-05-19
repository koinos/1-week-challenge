import { useEffect, useRef, useState } from "react";

export default function useTimer(seconds: number, onTimerEnd: () => void) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [counter, setCounter] = useState(seconds);

  useEffect(() => {
    clearInterval(timeoutRef.current);
    setCounter(seconds);
  }, [seconds]);

  useEffect(() => {
    if (counter > 0) {
      timeoutRef.current = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      onTimerEnd();
    }
  }, [counter, onTimerEnd]);

  return counter;
}
