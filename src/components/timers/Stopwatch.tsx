import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';
import { Container, TimeDisplay, Label, StatusBadge } from '../SharedStyles';

// ------------------- Helper Functions -------------------

const formatTime = (timeInMilliseconds: number): string => {
  const minutes = Math.floor(timeInMilliseconds / 60000);
  const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
  const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

// ------------------- Stopwatch Component -------------------

interface StopwatchProps {
  duration: number;
  status: Timer['status'];
  isActive?: boolean;
}

export default function Stopwatch({ duration, status }: StopwatchProps) {
  const { fastForward } = useTimerContext();

  const MAX_TIME = 150000; // 2 minutes 30 seconds
  const isMaxTimeReached = duration >= MAX_TIME;

  if (isMaxTimeReached && status === 'running') {
    fastForward();
  }

  return (
    <Container role="timer" aria-label="Stopwatch Timer">
      <Label>STOPWATCH</Label>
      <TimeDisplay>{formatTime(Math.min(duration, MAX_TIME))}</TimeDisplay>
      <StatusBadge status={status}>{status}</StatusBadge>
    </Container>
  );
}
