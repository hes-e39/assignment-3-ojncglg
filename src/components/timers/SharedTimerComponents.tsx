// This file contains shared components and styled elements used for timer functionalities.
// It includes progress bars, phase indicators, and timer summaries.

import styled from 'styled-components';
import { formatTime } from '../../utils/timeUtils';
import { InfoBox } from '../SharedStyles';
import type { ProgressBarProps } from './types';

// Progress bar container with fixed dimensions and visible background
export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  position: relative;
`;

// Progress indicator with enforced boundaries
export const Progress = styled.div<{ percent: number }>`
  width: ${props => Math.max(0, Math.min(100, props.percent))}%;
  height: 100%;
  background-color: #ffd700;
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.3s ease-out;
`;

// Label for the progress percentage
export const ProgressLabel = styled.div`
  font-size: 0.9rem;
  color: #ffd700;
  text-align: center;
  margin-bottom: 5px;
`;

// ProgressBar component to display the progress of a timer
export const ProgressBar = ({ percent, label, showLabel = true }: ProgressBarProps) => (
  <>
    {showLabel && label && <ProgressLabel>{label}</ProgressLabel>}
    <ProgressBarContainer>
      <Progress 
        percent={percent} 
        role="progressbar" 
        aria-valuenow={percent} 
        aria-valuemin={0} 
        aria-valuemax={100} 
      />
    </ProgressBarContainer>
  </>
);

// PhaseIndicator component to indicate the current phase (working/resting)
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

// TimerInfo component to display timer-related information
export const TimerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
`;

// RoundInfo component to display information about the current round
export const RoundInfo = styled.div`
  font-size: 1.5rem;
  color: #ffd700;
  margin: 10px 0;
`;

// TimerSummary component to display summary information about the timer
interface TimerSummaryProps {
  rounds?: number; // Number of rounds (optional)
  workTime?: number; // Work time in milliseconds (optional)
  restTime?: number; // Rest time in milliseconds (optional)
  totalTime: number; // Total time in milliseconds
}

export const TimerSummary = ({ rounds, workTime, restTime, totalTime }: TimerSummaryProps) => (
  <TimerInfo>
    {rounds && <InfoBox>Rounds: {rounds}</InfoBox>}
    {workTime && <InfoBox>Work: {formatTime(workTime)}</InfoBox>}
    {restTime && <InfoBox>Rest: {formatTime(restTime)}</InfoBox>}
    <InfoBox>Total: {formatTime(totalTime)}</InfoBox>
  </TimerInfo>
);

// TimerProgress component to display progress information for the timer
interface TimerProgressProps {
  currentRound: number; // Current round number
  rounds: number; // Total number of rounds
  duration: number; // Current duration in milliseconds
  isWorking: boolean; // Indicates if the timer is in the working phase
  workTime: number; // Work time in milliseconds
  restTime: number; // Rest time in milliseconds
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
