import type { FallbackProps } from 'react-error-boundary';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #000;
  border-radius: 8px;
  margin: 1rem;
  border: 2px solid #ff0000;
`;

const ErrorTitle = styled.h2`
  color: #ff0000;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: "Digital-7", "Roboto Mono", monospace;
`;

const ErrorMessage = styled.pre`
  color: #ffd700;
  margin-bottom: 1rem;
  font-family: "Digital-7", "Roboto Mono", monospace;
  text-align: center;
`;

const ResetButton = styled.button`
  background-color: #333;
  color: #ffd700;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Digital-7", "Roboto Mono", monospace;
  font-size: 1rem;
  transition: all 0.3s;

  &:hover {
    background-color: #444;
  }
`;

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <ErrorContainer>
      <ErrorTitle>Something went wrong!</ErrorTitle>
      <ErrorMessage>{error.message}</ErrorMessage>
      <ResetButton onClick={resetErrorBoundary}>
        Try again
      </ResetButton>
    </ErrorContainer>
  );
};
