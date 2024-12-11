import styled from 'styled-components';
import { formatTime } from '../../utils/timeUtils';
import { InfoBox } from '../SharedStyles';

export const PhaseIndicator = styled.div<{ isWorking: boolean }>`
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

export const TimerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
`;

export const RoundInfo = styled.div`
  font-size: 1.5rem;
  color: #ffd700;
  margin: 10px 0;
`;

interface TimerSummaryProps {
  rounds?: number;
  workTime?: number;
  restTime?: number;
  totalTime: number;
}

export const TimerSummary = ({ rounds, workTime, restTime, totalTime }: TimerSummaryProps) => (
  <TimerInfo>
    {rounds && <InfoBox>Rounds: {rounds}</InfoBox>}
    {workTime && <InfoBox>Work: {formatTime(workTime)}</InfoBox>}
    {restTime && <InfoBox>Rest: {formatTime(restTime)}</InfoBox>}
    <InfoBox>Total: {formatTime(totalTime)}</InfoBox>
  </TimerInfo>
);

interface TimerProgressProps {
  currentRound: number;
  rounds: number;
  duration: number;
  isWorking: boolean;
  workTime: number;
  restTime: number;
}

export const TimerProgress = ({ currentRound, rounds, duration, isWorking, workTime, restTime }: TimerProgressProps) => (
  <>
    <PhaseIndicator isWorking={isWorking}>{isWorking ? 'Work!' : 'Rest'}</PhaseIndicator>
    <RoundInfo>Round {currentRound} of {rounds}</RoundInfo>
    <TimerInfo>
      <InfoBox>Current: {formatTime(duration)}</InfoBox>
      <InfoBox>Phase: {isWorking ? 'Work' : 'Rest'}</InfoBox>
      <InfoBox>Work: {formatTime(workTime)}</InfoBox>
      <InfoBox>Rest: {formatTime(restTime)}</InfoBox>
    </TimerInfo>
  </>
);
