import { useState, useEffect } from "react";
import type { FC } from "react"; // Use `import type` for type-only imports

type CountdownProps = {
  duration: number; // Duration in milliseconds
  onComplete?: () => void; // Callback when countdown ends
};

const Countdown: FC<CountdownProps> = ({ duration, onComplete }) => {
  const [remainingTime, setRemainingTime] = useState<number>(duration);

  useEffect(() => {
    if (remainingTime <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, onComplete]);

  return <div>Remaining Time: {Math.max(remainingTime / 1000, 0)} seconds</div>;
};

export default Countdown;
