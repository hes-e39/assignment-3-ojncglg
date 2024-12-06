import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';
import { Container, InfoBox, Label, StatusBadge, TimeDisplay } from '../SharedStyles';

// ------------------- Styled Components -------------------

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

    const progressPercent = initialDuration > 0 ? Math.floor((duration / initialDuration) * 100) : 0;

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    const renderProgressBar = () => {
        if (!isActive) return null;

        return (
            <>
                <ProgressLabel>{Math.max(0, progressPercent)}% Remaining</ProgressLabel>
                <ProgressBarContainer>
                    <Progress percent={progressPercent} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} />
                </ProgressBarContainer>
            </>
        );
    };

    const renderTimeInfo = () => {
        if (!isActive) return null;

        return <InfoBox>{duration > 0 ? <span>Initial Time: {formatTime(initialDuration)}</span> : <span>Time's up!</span>}</InfoBox>;
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
