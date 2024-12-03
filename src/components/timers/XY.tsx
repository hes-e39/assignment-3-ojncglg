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
`;

const Label = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
  font-weight: bold;
`;

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

const TimerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
`;

const InfoBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #ffd700;
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

    // Handle interval completion
    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    // Only show detailed info when timer is active
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

    // Show summary when timer is not active
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
