import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { TIMER_CONFIG } from '../../utils/timerConfig';

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
`;

const Label = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
  font-weight: bold;
`;

const StatusBadge = styled.div<{ status: string }>`
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

// ------------------- Stopwatch Component -------------------

interface StopwatchProps {
    duration: number;
    status: 'not running' | 'running' | 'paused' | 'completed';
    isActive?: boolean;
}

export default function Stopwatch({ duration, status, isActive = false }: StopwatchProps) {
    const { fastForward } = useTimerContext();

    // Check if the stopwatch has reached its maximum time
    const isMaxTimeReached = duration >= TIMER_CONFIG.STOPWATCH_MAX_TIME;

    // Handle stopping at max time
    if (isMaxTimeReached && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="Stopwatch Timer">
            <Label>STOPWATCH</Label>
            <TimeDisplay>{formatTime(Math.min(duration, TIMER_CONFIG.STOPWATCH_MAX_TIME))}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
            {isActive && (
                <TimeInfo role="status" aria-live="polite">
                    {duration < TIMER_CONFIG.STOPWATCH_MAX_TIME ? <span>Time until max: {formatTime(TIMER_CONFIG.STOPWATCH_MAX_TIME - duration)}</span> : <span>Maximum time reached</span>}
                </TimeInfo>
            )}
        </Container>
    );
}
