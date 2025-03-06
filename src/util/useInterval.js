import { useEffect, useRef } from "react";

export function useInterval(callback, delay, gameOver, paused) {
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!gameOver && !paused) {
      // @ts-ignore
      const interval = setInterval(() => callbackRef.current(), delay);
      return () => clearInterval(interval);
    }
  }, [delay, gameOver, paused]);
}
