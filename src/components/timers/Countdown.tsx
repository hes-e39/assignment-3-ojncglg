import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';

// ------------------- Styled Components -------------------

// Main container for the countdown timer
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #000;
  border-radius: 10px;
  border: 2px solid #ffd700;
  width: 100%;
  max-width: 400px;
`;

// Large digital-style display for the time
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

// Title label above the timer
const Label = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
  font-weight: bold;
`;

// Badge showing the current status
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

// Container for the progress section
const ProgressSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
`;

// Progress bar container with fixed dimensions and visible background
const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 300px;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  padding: 3px;
  border: 2px solid #444;
`;

// Progress indicator with enforced boundaries
const Progress = styled.div<{ percent: number }>`
  width: ${props => Math.max(0, Math.min(100, props.percent))}%;
  height: 100%;
  background-color: #ffd700;
  border-radius: 8px;
  transition: width 0.3s ease;
`;

// Label for the progress percentage
const ProgressLabel = styled.div`
  font-size: 0.9rem;
  color: #ffd700;
  text-align: center;
  margin-bottom: 5px;
`;

// Container for additional timer information
const TimeInfo = styled.div`
  color: #ffd700;
  font-size: 1rem;
  text-align: center;
  margin-top: 10px;
`;

// ------------------- Helper Functions -------------------

const formatTime = (timeInMilliseconds: number): string => {
    const totalSeconds = Math.ceil(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// ------------------- Component Interface -------------------

interface CountdownProps {
    duration: number;
    initialDuration: number;
    status: Timer['status'];
    isActive?: boolean;
}

// ------------------- Countdown Component -------------------

export default function Countdown({ duration, initialDuration, status, isActive = false }: CountdownProps) {
    const { fastForward } = useTimerContext();

    // Calculate progress percentage
    const progressPercent = Math.floor((duration / initialDuration) * 100);

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    const renderProgressBar = () => {
        if (!isActive) return null;

        return (
            <ProgressSection>
                <ProgressLabel>{Math.max(0, progressPercent)}% Remaining</ProgressLabel>
                <ProgressBarContainer>
                    <Progress percent={progressPercent} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} />
                </ProgressBarContainer>
            </ProgressSection>
        );
    };

    const renderTimeInfo = () => {
        if (!isActive) return null;

        return (
            <TimeInfo role="status" aria-live="polite">
                {duration > 0 ? <span>Initial Time: {formatTime(initialDuration)}</span> : <span>Time's up!</span>}
            </TimeInfo>
        );
    };

    return (
        <Container role="timer" aria-label="Countdown Timer">
            <Label>COUNTDOWN</Label>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
            {renderProgressBar()}
            {renderTimeInfo()}
        </Container>
    );
}
