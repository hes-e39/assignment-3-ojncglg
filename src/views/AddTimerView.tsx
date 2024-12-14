import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerContext } from "../TimerContext";
import styled from "styled-components";
import type { Timer } from "../TimerContext";
import { TIMER_CONFIG } from "../timerConfig";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/generic/ErrorFallback";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: #ffd700;
  font-size: 1.1rem;
  font-family: 'Roboto', sans-serif;
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  background: #000;
  color: #ffd700;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  background: #000;
  color: #ffd700;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ $variant?: 'submit' | 'cancel' }>`
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  background: ${props => props.$variant === 'submit' ? '#ffd700' : '#666'};
  color: ${props => props.$variant === 'submit' ? '#000' : '#fff'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

function AddTimerContent() {
  const navigate = useNavigate();
  const { addTimer } = useTimerContext();

  const [type, setType] = useState<Timer["type"]>("stopwatch");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number | ''>(60);
  const [maxTime, setMaxTime] = useState<number | ''>(TIMER_CONFIG.STOPWATCH_MAX_TIME / 1000); // Convert from ms to seconds
  const [rounds, setRounds] = useState(5);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDuration = typeof duration === 'number' ? duration : 0;
    let newTimer: Timer;

    switch (type) {
      case "stopwatch": {
        newTimer = {
          type: "stopwatch",
          duration: 0,
          maxDuration: TIMER_CONFIG.STOPWATCH_MAX_TIME,
          status: "not running",
          description: description
        } as Timer;
        break;
      }

      case "countdown": {
        newTimer = {
          type: "countdown",
          duration: finalDuration * 1000,
          initialDuration: finalDuration * 1000,
          status: "not running",
          description: description
        } as Timer;
        break;
      }

      case "XY": {
        newTimer = {
          type: "XY",
          rounds: rounds,
          currentRound: 1,
          workTime: workTime * 1000,
          isWorking: true,
          duration: workTime * 1000,
          status: "not running",
          description: description
        } as Timer;
        break;
      }

      case "tabata": {
        newTimer = {
          type: "tabata",
          rounds: rounds,
          currentRound: 1,
          workTime: workTime * 1000,
          restTime: restTime * 1000,
          isWorking: true,
          duration: workTime * 1000,
          status: "not running",
          description: description
        } as Timer;
        break;
      }
    }

    addTimer(newTimer);
    navigate("/");
  };

  return (
    <Container>
      <h2>Add New Timer</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Description</Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done? (e.g., 50 push-ups)"
          />
        </FormGroup>

        <FormGroup>
          <Label>Timer Type</Label>
          <Select 
            value={type} 
            onChange={(e) => setType(e.target.value as Timer["type"])}
          >
            <option value="stopwatch">Stopwatch</option>
            <option value="countdown">Countdown</option>
            <option value="XY">XY</option>
            <option value="tabata">Tabata</option>
          </Select>
        </FormGroup>

        {type === "stopwatch" && (
          <FormGroup>
            <Label>Maximum Time (seconds)</Label>
            <Input
              type="number"
              min="1"
              value={maxTime}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setMaxTime('');
                } else {
                  const num = Number.parseInt(value, 10);
                  setMaxTime(Number.isNaN(num) ? 0 : Math.max(1, num));
                }
              }}
              required
            />
          </FormGroup>
        )}

        {type === "countdown" && (
          <FormGroup>
            <Label>Duration (seconds)</Label>
            <Input
              type="number"
              min="0"
              value={duration}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setDuration('');
                } else {
                  const num = Number.parseInt(value, 10);
                  setDuration(Number.isNaN(num) ? 0 : Math.max(0, num));
                }
              }}
              required
            />
          </FormGroup>
        )}

        {type === "XY" && (
          <>
            <FormGroup>
              <Label>Number of Rounds</Label>
              <Input
                type="number"
                min="1"
                value={rounds}
                onChange={(e) => {
                  const value = e.target.value;
                  const num = Number.parseInt(value, 10);
                  setRounds(Number.isNaN(num) ? 1 : Math.max(1, num));
                }}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Work Time (seconds)</Label>
              <Input
                type="number"
                min="1"
                value={workTime}
                onChange={(e) => {
                  const value = e.target.value;
                  const num = Number.parseInt(value, 10);
                  setWorkTime(Number.isNaN(num) ? 1 : Math.max(1, num));
                }}
                required
              />
            </FormGroup>
          </>
        )}

        {type === "tabata" && (
          <>
            <FormGroup>
              <Label>Number of Rounds</Label>
              <Input
                type="number"
                min="1"
                value={rounds}
                onChange={(e) => {
                  const value = e.target.value;
                  const num = Number.parseInt(value, 10);
                  setRounds(Number.isNaN(num) ? 1 : Math.max(1, num));
                }}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Work Time (seconds)</Label>
              <Input
                type="number"
                min="1"
                value={workTime}
                onChange={(e) => {
                  const value = e.target.value;
                  const num = Number.parseInt(value, 10);
                  setWorkTime(Number.isNaN(num) ? 1 : Math.max(1, num));
                }}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Rest Time (seconds)</Label>
              <Input
                type="number"
                min="1"
                value={restTime}
                onChange={(e) => {
                  const value = e.target.value;
                  const num = Number.parseInt(value, 10);
                  setRestTime(Number.isNaN(num) ? 1 : Math.max(1, num));
                }}
                required
              />
            </FormGroup>
          </>
        )}

        <ButtonGroup>
          <Button $variant="submit" type="submit">Add Timer</Button>
          <Button type="button" onClick={() => navigate("/")}>Cancel</Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default function AddTimerView() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the form state when the user clicks "Try again"
        window.location.reload();
      }}
    >
      <AddTimerContent />
    </ErrorBoundary>
  );
}
