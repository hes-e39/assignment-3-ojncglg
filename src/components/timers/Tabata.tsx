import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';

// Styled components stay the same...
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
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
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

interface TabataProps {
    duration: number;
    currentRound: number;
    rounds: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    status: 'not running' | 'running' | 'paused' | 'completed';
    isActive?: boolean;
}

export default function Tabata({ duration, currentRound, rounds, workTime, restTime, isWorking, status, isActive = false }: TabataProps) {
    const { fastForward } = useTimerContext();

    // Calculate progress percentage for the current interval
    const currentInterval = isWorking ? workTime : restTime;
    const remainingRounds = rounds - currentRound + 1;
    const remainingTime = duration + (remainingRounds - 1) * (workTime + restTime) + (isWorking ? restTime : 0);

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="Tabata Timer">
            <Label>TABATA</Label>
            {isActive && (
                <>
                    <PhaseIndicator isWorking={isWorking}>{isWorking ? 'Work!' : 'Rest'}</PhaseIndicator>

                    <div>
                        Round {currentRound} of {rounds}
                    </div>
                </>
            )}

            <TimeDisplay>{formatTime(duration)}</TimeDisplay>

            <StatusBadge status={status}>{status}</StatusBadge>

            {isActive ? (
                <TimerInfo>
                    <InfoBox>Interval: {formatTime(currentInterval)}</InfoBox>
                    <InfoBox>Remaining: {formatTime(remainingTime)}</InfoBox>
                </TimerInfo>
            ) : (
                <TimerInfo>
                    <InfoBox>Rounds: {rounds}</InfoBox>
                    <InfoBox>Work: {formatTime(workTime)}</InfoBox>
                    <InfoBox>Rest: {formatTime(restTime)}</InfoBox>
                    <InfoBox>Total: {formatTime((workTime + restTime) * rounds)}</InfoBox>
                </TimerInfo>
            )}
        </Container>
    );
}
