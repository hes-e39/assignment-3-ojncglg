import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { TIMER_CONFIG } from '../../timerConfig';
import TimerDisplay from './TimerDisplay';

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

const Label = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
`;

const TimeInfo = styled.div`
  font-family: 'Roboto', sans-serif;
  color: #ffd700;
  font-size: 1rem;
  text-align: center;
  margin-top: 10px;

  span {
    font-family: "Digital-7", monospace;
    font-variant-numeric: tabular-nums;
    font-size: 1.2em;
    letter-spacing: 2px;
  }
`;

// ------------------- Stopwatch Component -------------------

interface StopwatchProps {
    duration: number;
    maxDuration: number;
    status: 'not running' | 'running' | 'paused' | 'completed';
    isActive?: boolean;
}

export default function Stopwatch({ duration, maxDuration = TIMER_CONFIG.STOPWATCH_MAX_TIME, status, isActive = false }: StopwatchProps) {
    const { fastForward } = useTimerContext();

    const isMaxTimeReached = duration >= TIMER_CONFIG.STOPWATCH_MAX_TIME;

    if (isMaxTimeReached && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="Stopwatch Timer">
            <Label>Stopwatch</Label>
            <TimerDisplay duration={duration} maxDuration={maxDuration} status={status} />
            {isActive && (
                <TimeInfo role="status" aria-live="polite">
                    {duration < maxDuration ? (
                        <span>
                            Time until max: <span>{formatTime(maxDuration - duration)}</span>
                        </span>
                    ) : (
                        <span>Maximum time reached</span>
                    )}
                </TimeInfo>
            )}
        </Container>
    );
}
