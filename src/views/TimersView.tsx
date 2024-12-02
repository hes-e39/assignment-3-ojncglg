// Import the TimerContext hook for accessing timer-related state and actions
import { useTimerContext } from "../TimerContext";

// Import styled-components for defining custom styles directly in JavaScript
import styled from "styled-components";

// ------------------- Styled Components -------------------

// Container: Styles the layout for the TimersView page
const Container = styled.div`
  display: flex; /* Enables flexbox layout */
  flex-direction: column; /* Stacks elements vertically */
  align-items: center; /* Centers elements horizontally */
  padding: 20px; /* Adds padding around the content */
`;

// TimerItem: Styles each timer's display
const TimerItem = styled.div`
  border: 1px solid #ffd700; /* Yellow border for timers */
  padding: 10px; /* Inner padding for spacing */
  margin-bottom: 10px; /* Space between timers */
  width: 100%; /* Full width */
  max-width: 400px; /* Maximum width for larger screens */
  text-align: center; /* Centers the text inside */
  border-radius: 5px; /* Rounds the corners of the box */
`;

// Button: Styles the buttons for controlling timers
const Button = styled.button`
  padding: 15px 30px; /* Adds padding inside the button */
  font-size: 1.2rem; /* Sets medium font size */
  border-radius: 5px; /* Rounds the corners of the button */
  border: none; /* Removes default border */
  cursor: pointer; /* Changes cursor to pointer on hover */
  background-color: #000; /* Black background */
  color: #ffd700; /* Yellow text color */
  font-family: "Digital-7", "Roboto Mono", monospace; /* Digital-style font */
  text-transform: uppercase; /* Makes text uppercase */
  font-weight: bold; /* Makes text bold */
  transition: all 0.3s; /* Adds smooth hover animation */
  margin: 10px; /* Adds space between buttons */

  &:hover {
    opacity: 0.9; /* Slight transparency on hover */
  }

  &:active {
    transform: scale(0.95); /* Shrinks button slightly on click */
  }
`;

// ------------------- Helper Function -------------------

// formatTime: Converts milliseconds into a formatted time string (MM:SS.ms)
const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000); // Calculate minutes
  const seconds = Math.floor((milliseconds % 60000) / 1000); // Calculate seconds
  const ms = Math.floor((milliseconds % 1000) / 10); // Calculate milliseconds (2 digits)
  // Return formatted string in MM:SS.ms format
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
};

// ------------------- TimersView Component -------------------

// TimersView: Displays a list of timers and controls for managing them
const TimersView = () => {
  // Access state and actions from the TimerContext
  const { timers, toggleStartPause, resetTimers, fastForward, currentTimerIndex } =
    useTimerContext();

  return (
    <Container>
      {/* Page title */}
      <h1>Workout Timers</h1>

      {/* Map over the timers and display each one */}
      {timers.map((timer, index) => (
        <TimerItem key={timer.id}>
          {/* Display the type of timer (e.g., stopwatch, countdown) */}
          <h2>{timer.type}</h2>

          {/* Display the current status of the timer (e.g., running, paused) */}
          <p>Status: {timer.status}</p>

          {/* Show elapsed time for the active stopwatch timer */}
          {index === currentTimerIndex && timer.type === "stopwatch" && (
            <p>Time Elapsed: {formatTime(timer.duration)}</p>
          )}

          {/* Show remaining time for the active non-stopwatch timer */}
          {index === currentTimerIndex && timer.type !== "stopwatch" && (
            <p>Time Remaining: {formatTime(timer.duration)}</p>
          )}
        </TimerItem>
      ))}

      {/* Buttons to control the timers */}
      <Button onClick={toggleStartPause}>Start/Pause</Button> {/* Toggle start/pause */}
      <Button onClick={resetTimers}>Reset</Button> {/* Reset all timers */}
      <Button onClick={fastForward}>Fast-Forward</Button> {/* Skip to the next timer */}
    </Container>
  );
};

// Export the TimersView component as the default export
export default TimersView;
