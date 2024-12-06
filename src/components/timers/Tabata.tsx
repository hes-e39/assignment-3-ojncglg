import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';
import { Container, InfoBox, Label, StatusBadge, TimeDisplay } from '../SharedStyles';

// ------------------- Styled Components -------------------

const RoundInfo = styled.div`
  font-size: 1.8rem;
  color: #ffd700;
  margin: 10px 0;
`;

const PhaseIndicator = styled.div<{ isWorking: boolean }>`
  font-size: 2.5rem;
  color: ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  font-weight: bold;
  padding: 15px 30px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 3px solid ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ProgressRing = styled.div<{ percent: number; isWorking: boolean }>`
  width: 200px;
  height: 200px;
  position: relative;
  border-radius: 50%;
  background: conic-gradient(
    ${props => (props.isWorking ? '#2ecc40' : '#ff851b')} ${props => props.percent * 3.6}deg,
    transparent ${props => props.percent * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: #000;
  }
`;

// ------------------- Helper Functions -------------------

const formatTime = (timeInMilliseconds: number): string => {
    const totalSeconds = Math.ceil(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// ------------------- Component Interface -------------------

interface TabataProps {
    duration: number;
    currentRound: number;
    rounds: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    status: Timer['status'];
    isActive?: boolean;
}

// ------------------- Tabata Timer Component -------------------

export default function Tabata({ duration, currentRound, rounds, workTime, restTime, isWorking, status, isActive = false }: TabataProps) {
    const { fastForward } = useTimerContext();

    const currentInterval = isWorking ? workTime : restTime;
    const progressPercent = currentInterval > 0 ? Math.floor((duration / currentInterval) * 100) : 0;

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    const renderActiveInfo = () => {
        if (!isActive) return null;

        return (
            <>
                <PhaseIndicator isWorking={isWorking}>{isWorking ? 'Work!' : 'Rest'}</PhaseIndicator>
                <RoundInfo>
                    Round {currentRound} of {rounds}
                </RoundInfo>
                <ProgressRing percent={progressPercent} isWorking={isWorking}>
                    <TimeDisplay style={{ background: 'none', padding: 0 }}>{formatTime(duration)}</TimeDisplay>
                </ProgressRing>
                <InfoBox>Work: {formatTime(workTime)}</InfoBox>
                <InfoBox>Rest: {formatTime(restTime)}</InfoBox>
            </>
        );
    };

    const renderSummary = () => {
        if (isActive) return null;

        return (
            <>
                <InfoBox>Rounds: {rounds}</InfoBox>
                <InfoBox>Work: {formatTime(workTime)}</InfoBox>
                <InfoBox>Rest: {formatTime(restTime)}</InfoBox>
                <InfoBox>Total: {formatTime((workTime + restTime) * rounds)}</InfoBox>
            </>
        );
    };

    return (
        <Container role="timer" aria-label="Tabata Timer">
            <Label>TABATA</Label>
            {!isActive && <TimeDisplay>{formatTime(duration)}</TimeDisplay>}
            <StatusBadge status={status}>{status}</StatusBadge>
            {isActive ? renderActiveInfo() : renderSummary()}
        </Container>
    );
}
