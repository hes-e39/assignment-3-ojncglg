import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';

// ------------------- Styled Components -------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #000;
  border-radius: 10px;
  border: 2px solid #ffd700;
`;

const TimeDisplay = styled.div`
  font-family: "Digital-7", monospace;
  font-size: 48px;
  color: #ffd700;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  aria-live: polite;
`;

const Label = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
  font-weight: bold;
`;

const StatusBadge = styled.div<{ status: Timer['status'] }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status }) => {
      switch (status) {
          case 'running':
              return '#2ecc40';
          case 'paused':
              return '#ff851b';
          case 'completed':
              return '#ff4136';
          default:
              return '#7f8c8d';
      }
  }};
  color: white;
`;

const TimeInfo = styled.div`
  color: #ffd700;
  font-size: 1rem;
  text-align: center;
  margin-top: 10px;
`;

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
    status: Timer['status']; // Using the exact type from TimerContext
    isActive?: boolean;
}

export default function Stopwatch({ duration, status, isActive = false }: StopwatchProps) {
    const { fastForward } = useTimerContext();

    // Maximum time for stopwatch (2 minutes and 30 seconds)
    const MAX_TIME = 150000;

    // Check if the stopwatch has reached its maximum time
    const isMaxTimeReached = duration >= MAX_TIME;

    // Handle stopping at max time
    if (isMaxTimeReached && status === 'running') {
        fastForward();
    }

    const renderTimeInfo = () => {
        if (!isActive) return null;

        return (
            <TimeInfo role="status" aria-live="polite">
                {duration < MAX_TIME ? <span>Time until max: {formatTime(MAX_TIME - duration)}</span> : <span>Maximum time reached</span>}
            </TimeInfo>
        );
    };

    return (
        <Container role="timer" aria-label="Stopwatch Timer">
            <Label>STOPWATCH</Label>
            <TimeDisplay>{formatTime(Math.min(duration, MAX_TIME))}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
            {renderTimeInfo()}
        </Container>
    );
}
