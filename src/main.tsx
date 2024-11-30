// Importing necessary libraries and components for the app

// StrictMode is a tool for highlighting potential problems in an application.
import { StrictMode } from "react";

// createRoot is used to create the root element for rendering React components.
import { createRoot } from "react-dom/client";

// React Router imports to handle routing/navigation in the app.
import {
  Link, // Used to create links for navigation.
  Outlet, // A placeholder for nested routes.
  RouterProvider, // Provides routing context to the app.
  createHashRouter, // Used to define routes and navigation paths.
} from "react-router-dom";

// Importing styled-components for defining custom CSS styles directly in JS.
import styled from "styled-components";

// Importing global CSS file for general styling.
import "./index.css";

// Importing view components for specific routes.
import TimersView from "./views/TimersView"; // Displays all configured timers.
import DocumentationView from "./views/DocumentationView"; // Shows app documentation.
import AddTimerView from "./views/AddTimerView"; // Allows users to add new timers.

// Importing TimerProvider to manage timer state globally across the app.
import { TimerProvider } from "./TimerContext";

// ------------------- Styled Components -------------------

// PageContainer: A styled container for the entire page layout.
const PageContainer = styled.div`
  display: flex; /* Enables flexbox layout for alignment */
  flex-direction: column; /* Stacks items vertically */
  align-items: center; /* Centers items horizontally */
  background-color: #222; /* Dark background for the page */
  min-height: 100vh; /* Makes the container fill the entire viewport height */
  padding: 20px; /* Adds padding around the content */
  color: #ffd700; /* Sets text color to yellow */
  font-family: "Digital-7", "Roboto Mono", monospace; /* Digital-style font */
`;

// Header: A styled heading for the app title.
const Header = styled.h1`
  font-size: 2.5rem; /* Large font size */
  margin-bottom: 20px; /* Adds space below the heading */
  text-align: center; /* Centers the heading text */
  color: #ffd700; /* Yellow color for the text */
`;

// Navigation: A styled container for navigation buttons.
const Navigation = styled.div`
  display: flex; /* Enables flexbox layout */
  flex-direction: column; /* Stacks buttons vertically */
  justify-content: center; /* Centers buttons vertically */
  align-items: center; /* Aligns buttons horizontally */
  gap: 20px; /* Adds spacing between buttons */
  margin-top: 20px; /* Adds space above the navigation container */
  width: 100%; /* Makes the container responsive */
  max-width: 400px; /* Limits the maximum width for large screens */
`;

// Button: A styled Link component for navigation buttons.
const Button = styled(Link)`
  text-decoration: none; /* Removes underline from links */
  background-color: #000; /* Black background for buttons */
  color: #ffd700; /* Yellow text color */
  padding: 15px 30px; /* Adds padding inside the button */
  font-size: 1.2rem; /* Medium font size */
  border-radius: 5px; /* Rounds the button corners */
  font-family: "Digital-7", "Roboto Mono", monospace; /* Digital-style font */
  font-weight: bold; /* Bold text */
  text-transform: uppercase; /* Makes text all caps */
  text-align: center; /* Centers the text inside the button */
  transition: all 0.3s; /* Smooth animation for hover effects */
  cursor: pointer; /* Changes cursor to pointer on hover */
  width: 100%; /* Makes buttons responsive */
  max-width: 300px; /* Ensures buttons have consistent size */

  &:hover {
    opacity: 0.9; /* Slight transparency on hover */
  }

  &:active {
    transform: scale(0.95); /* Shrinks button slightly on click */
  }
`;

// ------------------- PageIndex Component -------------------

// PageIndex: The main layout and navigation for the app.
const PageIndex = () => {
  return (
    <PageContainer>
      {/* App title */}
      <Header>Assignment</Header>

      {/* Navigation buttons */}
      <Navigation>
        <Button to="/">Timers</Button> {/* Link to the TimersView route */}
        <Button to="/docs">Documentation</Button> {/* Link to DocumentationView */}
        <Button to="/add">Add Timer</Button> {/* Link to AddTimerView */}
      </Navigation>

      {/* Outlet displays nested routes like TimersView, DocumentationView, etc. */}
      <Outlet />
    </PageContainer>
  );
};

// ------------------- Router Configuration -------------------

// Define routes and their corresponding components using createHashRouter.
const router = createHashRouter([
  {
    path: "/", // Base path
    element: <PageIndex />, // Layout for this route
    children: [
      { index: true, element: <TimersView /> }, // Default route displays TimersView
      { path: "/docs", element: <DocumentationView /> }, // Documentation route
      { path: "/add", element: <AddTimerView /> }, // Add Timer route
    ],
  },
]);

// ------------------- App Initialization -------------------

// Mount the React app to the root DOM element.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap the app with TimerProvider to provide global timer state */}
    <TimerProvider>
      {/* Provide routing context to the app */}
      <RouterProvider router={router} />
    </TimerProvider>
  </StrictMode>
);
