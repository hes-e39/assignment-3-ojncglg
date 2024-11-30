import type { FC } from "react";

type XYProps = {
  rounds: number;
  workTime: number; // Work time in seconds
  restTime: number; // Rest time in seconds
};

const XY: FC<XYProps> = ({ rounds, workTime, restTime }) => {
  return (
    <div>
      <h2>XY Timer</h2>
      <p>Rounds: {rounds}</p>
      <p>Work Time: {workTime} seconds</p>
      <p>Rest Time: {restTime} seconds</p>
    </div>
  );
};

export default XY;
