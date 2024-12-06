import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useTimerContext } from '../TimerContext';
import type { Timer } from '../TimerContext';

// ------------------- Styled Components -------------------

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

const ErrorMessage = styled.div`
  color: #ff4136;
  font-size: 0.9rem;
  margin-top: -10px;
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

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

// ------------------- AddTimerView Component -------------------

function AddTimerView() {
    const navigate = useNavigate();
    const { addTimer } = useTimerContext();

    // Timer state
    const [type, setType] = useState<Timer['type']>('stopwatch');
    const [duration, setDuration] = useState<number | ''>(60); // For countdown
    const [rounds, setRounds] = useState<number>(0); // For XY and Tabata
    const [workTime, setWorkTime] = useState<number>(0); // For XY and Tabata
    const [restTime, setRestTime] = useState<number>(0); // For XY and Tabata
    const [error, setError] = useState<string | null>(null); // Error message state

    const validateInputs = (): boolean => {
        if (type === 'XY' || type === 'tabata') {
            if (rounds <= 0 || workTime <= 0 || restTime <= 0) {
                setError('Dont be silly, Rounds, Work Time, and Rest Time must be greater than 0.');
                return false;
            }
        }
        setError(null);
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInputs()) return;

        const finalDuration = typeof duration === 'number' ? duration : 0;

        let newTimer: Timer;

        switch (type) {
            case 'stopwatch':
                newTimer = {
                    id: uuidv4(),
                    type: 'stopwatch',
                    duration: 0,
                    status: 'not running',
                };
                break;

            case 'countdown':
                newTimer = {
                    id: uuidv4(),
                    type: 'countdown',
                    duration: finalDuration * 1000,
                    initialDuration: finalDuration * 1000,
                    status: 'not running',
                };
                break;

            case 'XY':
                newTimer = {
                    id: uuidv4(),
                    type: 'XY',
                    rounds,
                    currentRound: 1,
                    workTime: workTime * 1000,
                    restTime: restTime * 1000,
                    isWorking: true,
                    duration: workTime * 1000,
                    status: 'not running',
                };
                break;

            case 'tabata':
                newTimer = {
                    id: uuidv4(),
                    type: 'tabata',
                    rounds,
                    currentRound: 1,
                    workTime: workTime * 1000,
                    restTime: restTime * 1000,
                    isWorking: true,
                    duration: workTime * 1000,
                    status: 'not running',
                };
                break;
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
                        <Input type="number" min="0" value={duration} onChange={e => setDuration(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))} required />
                    </FormGroup>
                )}

                {(type === 'XY' || type === 'tabata') && (
                    <>
                        <FormGroup>
                            <Label>Number of Rounds</Label>
                            <Input type="number" min="0" value={rounds} onChange={e => setRounds(Math.max(0, Number(e.target.value)))} required />
                        </FormGroup>

                        <FormGroup>
                            <Label>Work Time (seconds)</Label>
                            <Input type="number" min="0" value={workTime} onChange={e => setWorkTime(Math.max(0, Number(e.target.value)))} required />
                        </FormGroup>

                        <FormGroup>
                            <Label>Rest Time (seconds)</Label>
                            <Input type="number" min="0" value={restTime} onChange={e => setRestTime(Math.max(0, Number(e.target.value)))} required />
                        </FormGroup>
                    </>
                )}

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <ButtonGroup>
                    <Button $variant="submit" type="submit" disabled={error !== null}>
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

export default AddTimerView;
