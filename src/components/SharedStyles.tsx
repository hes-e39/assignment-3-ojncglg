import styled from 'styled-components';

export const TimeDisplayContainer = styled.div<{ status: string }>`
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

export const TimeRemaining = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #ffd700;
  margin-top: 5px;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 10px;
`;

export const TimerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

export const TimerType = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  text-transform: uppercase;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #000;
  border-radius: 10px;
  border: 2px solid #ffd700;
`;

export const TimeDisplay = styled.div`
  font-family: "Digital-7", monospace;
  font-size: 48px;
  color: #ffd700;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
`;

export const Label = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
  font-weight: bold;
`;

export const StatusBadge = styled.div<{ status: string }>`
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

export const InfoBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #ffd700;
`;

export const DeleteButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover, &:focus {
    background-color: #ff2222;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const StatusIndicator = styled.div<{ status: string }>`
  color: ${({ status }) => 
    status === 'running' ? '#4CAF50' : 
    status === 'completed' ? '#FFD700' : '#ff4444'
  };
  font-size: 0.8em;
  background-color: #222;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid currentColor;
  font-weight: bold;
  letter-spacing: 0.5px;
`;
