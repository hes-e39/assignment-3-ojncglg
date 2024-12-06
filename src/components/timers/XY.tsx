import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';
import { Container, InfoBox, Label, StatusBadge, TimeDisplay } from '../SharedStyles';

// ------------------- Styled Components -------------------

const RoundInfo = styled.div`
  font-size: 1.5rem;
  color: #ffd700;
  margin: 10px 0;
`;

const PhaseIndicator = styled.div<{ isWorking: boolean }>`
  font-size: 1.8rem;
  color: ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const TimerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 300px;
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

interface XYProps {
    duration: number;
    currentRound: number;
    rounds: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    status: Timer['status'];
    isActive?: boolean;
}

// ------------------- XY Timer Component -------------------

export default function XY({ duration, currentRound, rounds, workTime, restTime, isWorking, status, isActive = false }: XYProps) {
    const { fastForward } = useTimerContext();

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    const renderActiveInfo = () => {
        if (!isActive) return null;

        return (
            <>
                <PhaseIndicator isWorking={isWorking}>{isWorking ? 'Work' : 'Rest'}</PhaseIndicator>
                <RoundInfo>
                    Round {currentRound} of {rounds}
                </RoundInfo>
                <TimerInfo>
                    <InfoBox>Work: {formatTime(workTime)}</InfoBox>
                    <InfoBox>Rest: {formatTime(restTime)}</InfoBox>
                    <InfoBox>Current: {formatTime(duration)}</InfoBox>
                    <InfoBox>Phase: {isWorking ? 'Work' : 'Rest'}</InfoBox>
                </TimerInfo>
            </>
        );
    };

    const renderSummary = () => {
        if (isActive) return null;

        return (
            <TimerInfo>
                <InfoBox>Rounds: {rounds}</InfoBox>
                <InfoBox>Work: {formatTime(workTime)}</InfoBox>
                <InfoBox>Rest: {formatTime(restTime)}</InfoBox>
                <InfoBox>Total: {formatTime((workTime + restTime) * rounds)}</InfoBox>
            </TimerInfo>
        );
    };

    return (
        <Container role="timer" aria-label="XY Timer">
            <Label>XY TIMER</Label>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
            {isActive ? renderActiveInfo() : renderSummary()}
        </Container>
    );
}
