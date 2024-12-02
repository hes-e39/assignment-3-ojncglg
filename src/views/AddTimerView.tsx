import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerContext } from "../TimerContext";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import type { FC } from "react";

// Styled components for Add Timer View
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #222;
  color: #ffd700;
  font-family: "Digital-7", "Roboto Mono", monospace;
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  background-color: #000;
  color: #ffd700;
`;

const Select = styled.select`
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  background-color: #000;
  color: #ffd700;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-family: "Digital-7", "Roboto Mono", monospace;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.3s;
  background-color: #ccc;
  color: #000;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddTimerView: FC = () => {
  const { addTimer } = useTimerContext();
  const navigate = useNavigate();

  // State for timer inputs
  const [type, setType] = useState<"stopwatch" | "countdown" | "XY" | "tabata">("stopwatch");
  const [duration, setDuration] = useState<number>(0); // In seconds
  const [description, setDescription] = useState<string>(""); // State for the description

  const handleAddTimer = (e: React.FormEvent) => {
    e.preventDefault();

    // Add the new timer to the TimerContext
    addTimer({
      id: uuidv4(),
      type,
      duration: type === "stopwatch" ? 0 : duration * 1000, // Convert seconds to milliseconds
      status: "not running",
      description, // Add the description
    });

    // Navigate back to the main page after adding the timer
    navigate("/");
  };

  return (
    <Container>
      <Title>Add a New Timer</Title>
      <Form onSubmit={handleAddTimer}>
        <Select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "stopwatch" | "countdown" | "XY" | "tabata")
          }
        >
          <option value="stopwatch">Stopwatch</option>
          <option value="countdown">Countdown</option>
          <option value="XY">XY Timer</option>
          <option value="tabata">Tabata Timer</option>
        </Select>

        {type !== "stopwatch" && (
          <Input
            type="number"
            min="0"
            placeholder="Enter duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        )}

        {/* Input for timer description */}
        <Input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <ButtonContainer>
          <Button type="submit">Add Timer</Button>
          <Button type="button" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AddTimerView;
