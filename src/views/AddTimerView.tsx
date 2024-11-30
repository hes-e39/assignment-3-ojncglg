// Import necessary hooks and utilities from React and React Router
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation between routes
import { useTimerContext } from "../TimerContext"; // Custom hook to access timer context
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for timers
import styled from "styled-components"; // For styling components
import type { FC } from "react"; // Type-only import for functional components

// ------------------- Styled Components -------------------

// Container: Styles the main page layout with centered content and dark theme
const Container = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  background-color: #222; /* Dark background color */
  color: #ffd700; /* Yellow text color */
  font-family: "Digital-7", "Roboto Mono", monospace; /* Digital-style font */
  min-height: 100vh; /* Full viewport height */
  padding: 20px; /* Add padding around content */
`;

// Title: Styles the heading for the page
const Title = styled.h1`
  font-size: 2rem; /* Medium font size */
  margin-bottom: 20px; /* Space below the heading */
`;

// Form: Styles the form for adding a new timer
const Form = styled.form`
  display: flex;
  flex-direction: column; /* Stack form elements vertically */
  gap: 20px; /* Add space between form elements */
  width: 100%; /* Make the form fill its container */
  max-width: 400px; /* Limit the width for larger screens */
`;

// Select: Styles the dropdown for selecting the timer type
const Select = styled.select`
  padding: 15px; /* Inner padding for better click area */
  font-size: 1.2rem; /* Medium font size */
  border-radius: 5px; /* Rounded corners */
  border: none; /* Remove default border */
  background-color: #000; /* Black background color */
  color: #ffd700; /* Yellow text color */
`;

// Input: Styles the input field for entering timer duration
const Input = styled.input`
  padding: 15px; /* Inner padding for better typing area */
  font-size: 1.2rem; /* Medium font size */
  border-radius: 5px; /* Rounded corners */
  border: none; /* Remove default border */
  background-color: #000; /* Black background color */
  color: #ffd700; /* Yellow text color */
`;

// ButtonContainer: Styles the container for buttons
const ButtonContainer = styled.div`
  display: flex; /* Place buttons side by side */
  gap: 20px; /* Add space between buttons */
  justify-content: center; /* Center align the buttons */
  margin-top: 20px; /* Add space above the buttons */
`;

// Button: Styles the buttons for submitting or canceling the form
const Button = styled.button`
  padding: 15px 30px; /* Inner padding for better click area */
  font-size: 1.2rem; /* Medium font size */
  border-radius: 5px; /* Rounded corners */
  border: none; /* Remove default border */
  cursor: pointer; /* Pointer cursor on hover */
  font-family: "Digital-7", "Roboto Mono", monospace; /* Digital-style font */
  text-transform: uppercase; /* Uppercase text */
  font-weight: bold; /* Bold text */
  transition: all 0.3s; /* Smooth hover effect */

  /* Default styles for gray buttons */
  background-color: #ccc; /* Light gray background */
  color: #000; /* Black text color */

  &:hover {
    opacity: 0.9; /* Slightly transparent on hover */
  }

  &:active {
    transform: scale(0.95); /* Shrinks button slightly on click */
  }
`;

// ------------------- AddTimerView Component -------------------

// AddTimerView: Page for adding a new timer
const AddTimerView: FC = () => {
  const { addTimer } = useTimerContext(); // Access the addTimer function from TimerContext
  const navigate = useNavigate(); // Hook to navigate between routes

  // State to track the type of timer being added
  const [type, setType] = useState<"stopwatch" | "countdown" | "XY" | "tabata">("stopwatch");

  // State to track the duration of the timer
  const [duration, setDuration] = useState<number>(0);

  // ------------------- Handle Form Submission -------------------

  const handleAddTimer = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Add the timer to the TimerContext
    addTimer({
      id: uuidv4(), // Generate a unique ID for the timer
      type, // Timer type (stopwatch, countdown, etc.)
      duration: type === "stopwatch" ? 0 : duration * 1000, // Convert duration to milliseconds (0 for stopwatch)
      status: "not running", // Initial status of the timer
    });

    // Navigate back to the main page after adding the timer
    navigate("/");
  };

  // ------------------- Render Component -------------------

  return (
    <Container>
      {/* Page Title */}
      <Title>Add a New Timer</Title>

      {/* Form for adding a timer */}
      <Form onSubmit={handleAddTimer}>
        {/* Dropdown for selecting timer type */}
        <Select
          value={type} // Bind to state
          onChange={(e) =>
            setType(e.target.value as "stopwatch" | "countdown" | "XY" | "tabata")
          }
        >
          {/* Timer type options */}
          <option value="stopwatch">Stopwatch</option>
          <option value="countdown">Countdown</option>
          <option value="XY">XY Timer</option>
          <option value="tabata">Tabata Timer</option>
        </Select>

        {/* Input for timer duration, only shown for non-stopwatch timers */}
        {type !== "stopwatch" && (
          <Input
            type="number" // Input type is number
            min="0" // Minimum value is 0
            placeholder="Enter duration (seconds)" // Placeholder text
            value={duration} // Bind to state
            onChange={(e) => setDuration(Number(e.target.value))} // Update state on change
            required // Make input required
          />
        )}

        {/* Buttons for submitting or canceling */}
        <ButtonContainer>
          <Button type="submit">Add Timer</Button> {/* Submit the form */}
          <Button type="button" onClick={() => navigate("/")}>
            Cancel
          </Button> {/* Navigate back without adding a timer */}
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AddTimerView; // Export the component
