import styled from 'styled-components';

// Font specifically for numerical time display
export const TimeDisplay = styled.div`
  font-family: 'Digital-7', monospace;
  font-variant-numeric: tabular-nums; // Prevents jittering
  font-size: 48px;
  color: #ffd700;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  letter-spacing: 2px; // Helps with number spacing
`;

// Regular text display for labels and other content
export const TextDisplay = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
`;

// Status badge with regular font
export const StatusBadge = styled.div<{ status: string }>`
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

// Title text with regular font
export const Title = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0;
  font-weight: bold;
`;
