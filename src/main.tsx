// This file serves as the entry point for the React application.
// It sets up the main application structure, routing, and error handling.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Link,
  Outlet,
  RouterProvider,
  createHashRouter,
} from 'react-router-dom';
import styled from 'styled-components';
import './index.css';
import { ErrorFallback } from './components/generic/ErrorFallback';
import TimersView from './views/TimersView';
import DocumentationView from './views/DocumentationView';
import AddTimerView from './views/AddTimerView';
import HistoryView from './views/HistoryView';
import { TimerProvider } from './TimerContext';

// ------------------- Styled Components -------------------

// Styled container for the main page
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #222;
  min-height: 100vh;
  padding: 20px;
  color: #ffd700;
  font-family: "Digital-7", "Roboto Mono", monospace;
`;

// Styled header for the main page
const Header = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #ffd700;
`;

// Styled navigation container
const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
`;

// Styled button for navigation links
const Button = styled(Link)`
  text-decoration: none;
  background-color: #000;
  color: #ffd700;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  font-family: "Digital-7", "Roboto Mono", monospace;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  width: 100%;
  max-width: 300px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

// ------------------- PageIndex Component -------------------

// PageIndex component serves as the main layout for the application
const PageIndex = () => {
  return (
    <PageContainer>
      <Header>Assignment</Header>
      <Navigation>
        <Button to="/">Timers</Button>
        <Button to="/history">History</Button>
        <Button to="/docs">Documentation</Button>
        <Button to="/add">Add Timer</Button>
      </Navigation>
      <Outlet />
    </PageContainer>
  );
};

// ------------------- Router Configuration -------------------

// Create a hash router for the application
const router = createHashRouter([
  {
    path: '/',
    element: <PageIndex />,
    children: [
      { index: true, element: <TimersView /> },
      { path: '/history', element: <HistoryView /> },
      { path: '/docs', element: <DocumentationView /> },
      { path: '/add', element: <AddTimerView /> },
    ],
  },
]);

// ------------------- App Initialization -------------------

// Render the application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the app state
        window.location.reload();
      }}
    >
      <TimerProvider>
        <RouterProvider router={router} />
      </TimerProvider>
    </ErrorBoundary>
  </StrictMode>
);
