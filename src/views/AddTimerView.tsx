import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTimerContext } from '../TimerContext';
import type { Timer } from '../TimerContext';

// Styled components for layout and appearance
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
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  background: #000;
  color: #ffd700;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  background: #000;
  color: #ffd700;
  font-size: 1rem;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// New styled component for error messages
const ErrorMessage = styled.div`
  color: #ff4136;
  font-size: 0.9rem;
  margin-top: 4px;
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
  background: ${props => (props.$variant === 'submit' ? '#ffd700' : '#666')};
  color: ${props => (props.$variant === 'submit' ? '#000' : '#fff')};
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export default function AddTimerView() {
    const navigate = useNavigate();
    const { addTimer } = useTimerContext();

    // Basic timer state
    const [type, setType] = useState<Timer['type']>('stopwatch');
    const [duration, setDuration] = useState<number | ''>(60);
    const [rounds, setRounds] = useState<number | ''>(5);
    const [workTime, setWorkTime] = useState<number | ''>(30);
    const [restTime, setRestTime] = useState<number | ''>(10);

    // Error state for validation messages
    const [roundsError, setRoundsError] = useState('');
    const [workTimeError, setWorkTimeError] = useState('');

    // Validation function for the form
    const validateForm = (): boolean => {
        let isValid = true;

        // Validate rounds for XY and Tabata timers
        if ((type === 'XY' || type === 'tabata') && (typeof rounds !== 'number' || rounds <= 0)) {
            setRoundsError('Number of rounds must be greater than 0');
            isValid = false;
        }

        // Validate work time for XY and Tabata timers
        if ((type === 'XY' || type === 'tabata') && (typeof workTime !== 'number' || workTime <= 0)) {
            setWorkTimeError('Work time must be greater than 0');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear any existing error messages
        setRoundsError('');
        setWorkTimeError('');

        // Validate form before submission
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        // Ensure we have valid numbers for our timer
        const finalDuration = typeof duration === 'number' ? duration : 0;
        const finalRounds = typeof rounds === 'number' ? rounds : 1;
        const finalWorkTime = typeof workTime === 'number' ? workTime : 30;
        const finalRestTime = typeof restTime === 'number' ? restTime : 10;

        let newTimer: Timer;

        switch (type) {
            case 'stopwatch': {
                newTimer = {
                    type: 'stopwatch',
                    duration: 0,
                    status: 'not running',
                } as Timer;
                break;
            }

            case 'countdown': {
                newTimer = {
                    type: 'countdown',
                    duration: finalDuration * 1000,
                    initialDuration: finalDuration * 1000,
                    status: 'not running',
                } as Timer;
                break;
            }

            case 'XY': {
                newTimer = {
                    type: 'XY',
                    rounds: finalRounds,
                    currentRound: 1,
                    workTime: finalWorkTime * 1000,
                    isWorking: true,
                    duration: finalWorkTime * 1000,
                    status: 'not running',
                } as Timer;
                break;
            }

            case 'tabata': {
                newTimer = {
                    type: 'tabata',
                    rounds: finalRounds,
                    currentRound: 1,
                    workTime: finalWorkTime * 1000,
                    restTime: finalRestTime * 1000,
                    isWorking: true,
                    duration: finalWorkTime * 1000,
                    status: 'not running',
                } as Timer;
                break;
            }
        }

        addTimer(newTimer);
        navigate('/');
    };

    return (
        <Container>
            <h2>Add New Timer</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Timer Type</Label>
                    <Select value={type} onChange={e => setType(e.target.value as Timer['type'])}>
                        <option value="stopwatch">Stopwatch</option>
                        <option value="countdown">Countdown</option>
                        <option value="XY">XY</option>
                        <option value="tabata">Tabata</option>
                    </Select>
                </FormGroup>

                {type === 'countdown' && (
                    <FormGroup>
                        <Label>Duration (seconds)</Label>
                        <Input
                            type="number"
                            min="0"
                            value={duration}
                            onChange={e => {
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

                {type === 'XY' && (
                    <>
                        <FormGroup>
                            <Label>Number of Rounds</Label>
                            <Input
                                type="number"
                                value={rounds}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setRounds('');
                                        return;
                                    }
                                    const num = Number.parseInt(value, 10);
                                    if (!Number.isNaN(num)) {
                                        setRounds(num);
                                        setRoundsError(num <= 0 ? 'Number of rounds must be greater than 0' : '');
                                    }
                                }}
                                required
                            />
                            {roundsError && <ErrorMessage>{roundsError}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Work Time (seconds)</Label>
                            <Input
                                type="number"
                                value={workTime}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setWorkTime('');
                                        return;
                                    }
                                    const num = Number.parseInt(value, 10);
                                    if (!Number.isNaN(num)) {
                                        setWorkTime(num);
                                        setWorkTimeError(num <= 0 ? 'Work time must be greater than 0' : '');
                                    }
                                }}
                                required
                            />
                            {workTimeError && <ErrorMessage>{workTimeError}</ErrorMessage>}
                        </FormGroup>
                    </>
                )}

                {type === 'tabata' && (
                    <>
                        <FormGroup>
                            <Label>Number of Rounds</Label>
                            <Input
                                type="number"
                                value={rounds}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setRounds('');
                                        return;
                                    }
                                    const num = Number.parseInt(value, 10);
                                    if (!Number.isNaN(num)) {
                                        setRounds(num);
                                        setRoundsError(num <= 0 ? 'Number of rounds must be greater than 0' : '');
                                    }
                                }}
                                required
                            />
                            {roundsError && <ErrorMessage>{roundsError}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Work Time (seconds)</Label>
                            <Input
                                type="number"
                                value={workTime}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setWorkTime('');
                                        return;
                                    }
                                    const num = Number.parseInt(value, 10);
                                    if (!Number.isNaN(num)) {
                                        setWorkTime(num);
                                        setWorkTimeError(num <= 0 ? 'Work time must be greater than 0' : '');
                                    }
                                }}
                                required
                            />
                            {workTimeError && <ErrorMessage>{workTimeError}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Rest Time (seconds)</Label>
                            <Input
                                type="number"
                                value={restTime}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setRestTime('');
                                        return;
                                    }
                                    const num = Number.parseInt(value, 10);
                                    if (!Number.isNaN(num)) {
                                        setRestTime(Math.max(1, num));
                                    }
                                }}
                                required
                            />
                        </FormGroup>
                    </>
                )}

                <ButtonGroup>
                    <Button $variant="submit" type="submit">
                        Add Timer
                    </Button>
                    <Button type="button" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </Form>
        </Container>
    );
}
