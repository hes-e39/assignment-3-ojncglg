import styled from 'styled-components';
import { formatTime } from '../../utils/timeUtils';

// ------------------- Styled Components -------------------

const TimeDisplayContainer = styled.div<{ status: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
  padding: 20px;
  padding-bottom: 60px;
  border: 2px solid ${({ status }) => {
      switch (status) {
          case 'running':
              return '#2ecc40';
          case 'paused':
              return '#ff851b';
          case 'completed':
              return '#ff4136';
          case 'ready':
              return '#2196F3';
          default:
              return '#7f8c8d';
      }
  }};
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.3);
`;

const TimeRemaining = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #ffd700;
  margin-top: 5px;
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

// ------------------- TimerDisplay Component -------------------

interface TimerDisplayProps {
    duration: number;
    maxDuration?: number;
    status: string;
    onDelete?: () => void;
}

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 10px;
`;

const TimerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const TimerType = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  text-transform: uppercase;
`;

const TimerDisplay: React.FC<TimerDisplayProps> = ({ duration, maxDuration, status, onDelete }) => {
    const displayStatus = status === 'not running' ? 'ready' : status;

    return (
        <TimeDisplayContainer status={displayStatus}>
            <TimerHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TimerType>STOPWATCH</TimerType>
                    <div
                        style={{
                            color: displayStatus === 'running' ? '#4CAF50' : displayStatus === 'completed' ? '#FFD700' : '#ff4444',
                            fontSize: '0.8em',
                            backgroundColor: '#222',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            border: '1px solid currentColor',
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {displayStatus === 'ready' ? 'DELETE' : displayStatus.toUpperCase()}
                    </div>
                </div>
            </TimerHeader>
            <TimeDisplay>{formatTime(maxDuration ? Math.min(duration, maxDuration) : duration)}</TimeDisplay>
            {maxDuration && status !== 'completed' && (
                <TimeRemaining style={{ textAlign: 'center' }}>
                    {status === 'not running' ? <>Total time: {formatTime(maxDuration)}</> : <>Time remaining: {formatTime(Math.max(0, maxDuration - duration))}</>}
                </TimeRemaining>
            )}
            <ButtonContainer>
                {status !== 'running' && (
                    <button
                        onClick={onDelete}
                        style={{
                            backgroundColor: '#ff4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '14px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = '#ff2222';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onFocus={e => {
                            e.currentTarget.style.backgroundColor = '#ff2222';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = '#ff4444';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onBlur={e => {
                            e.currentTarget.style.backgroundColor = '#ff4444';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        aria-label="Delete timer"
                    >
                        Delete
                    </button>
                )}
            </ButtonContainer>
        </TimeDisplayContainer>
    );
};

export default TimerDisplay;
