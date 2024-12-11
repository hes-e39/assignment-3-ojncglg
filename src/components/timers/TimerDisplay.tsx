import styled from 'styled-components';
import { formatTime } from '../../utils/timeUtils';

// ------------------- Styled Components -------------------

const TimeDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TimeDisplay = styled.div`
  font-family: "Digital-7", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 72px;
  color: #ffd700;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  letter-spacing: 4px;
  margin: 10px 0;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const StatusBadge = styled.div<{ status: string }>`
  font-family: 'Roboto', sans-serif;
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

// ------------------- TimerDisplay Component -------------------

interface TimerDisplayProps {
    duration: number;
    maxDuration?: number;
    status: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ duration, maxDuration, status }) => {
    return (
        <TimeDisplayContainer>
            <TimeDisplay>{formatTime(maxDuration ? Math.min(duration, maxDuration) : duration)}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
        </TimeDisplayContainer>
    );
};

export default TimerDisplay;
