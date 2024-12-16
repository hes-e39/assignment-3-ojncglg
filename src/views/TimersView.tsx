import styled from 'styled-components';
import { useTimerContext } from '../TimerContext';
import type { Timer, StopwatchTimer, CountdownTimer, XYTimer, TabataTimer } from '../TimerContext';
import { formatTime } from '../utils/timeUtils';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/generic/ErrorFallback';
import TimerDisplay from '../components/timers/TimerDisplay';

// ------------------- Styled Components -------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TimersList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
`;

const TimerCard = styled.div<{ status: Timer['status']; isEditing?: boolean }>`
  background: #000;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

const EditInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ffd700;
  background: #111;
  color: #ffd700;
  font-size: 0.9rem;
  width: 100%;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const EditButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const EditActionButton = styled.button<{ $variant?: 'save' | 'cancel' }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: ${props => props.$variant === 'save' ? '#4CAF50' : '#ff4136'};
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const Button = styled.button<{ $variant?: 'save' | 'edit' | 'default' }>`
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  background: ${props => {
    switch (props.$variant) {
      case 'save':
        return '#4CAF50';
      case 'edit':
        return '#ffd700';
      default:
        return '#ffd700';
    }
  }};
  color: ${props => props.$variant === 'save' ? '#fff' : '#000'};
  cursor: pointer;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }

  &[data-editing="true"] {
    background: #4CAF50;
    color: #fff;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background: #4CAF50;
  color: white;
  border-radius: 5px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 1000;

  &.show {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MoveButton = styled(Button)`
  padding: 12px 20px;
  margin: 0;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.disabled ? '#666' : '#ffd700'};
  color: #000;
  
  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background-color: #ff2222;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const TotalTime = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  margin: 20px 0;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: 'Roboto', sans-serif;

  .time-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  span {
    font-family: 'Digital-7', monospace;
    font-size: 1.4rem;
    letter-spacing: 2px;
  }

  .remaining {
    color: ${props => props.theme.colors?.accent || '#2ecc40'};
  }
`;

// ------------------- TimersView Component -------------------

const TimersContent = () => {
    const { timers, currentTimerIndex, toggleStartPause, fastForward, resetTimers, removeTimer, getTotalTime, getRemainingTime, saveToUrl, updateTimer, moveTimer } = useTimerContext();
    const [editingTimer, setEditingTimer] = useState<string | null>(null);

    return (
        <Container>
            <h2>Workout Timers</h2>

            <TotalTime>
                <div className="time-row">
                    Total Workout Time: <span>{formatTime(getTotalTime())}</span>
                </div>
                {currentTimerIndex !== null && timers[currentTimerIndex]?.status === 'running' && (
                    <div className="time-row">
                        Time Remaining: <span className="remaining">{formatTime(getRemainingTime())}</span>
                    </div>
                )}
            </TotalTime>

            <TimersList>
                {timers.map((timer, index) => (
                    <TimerCard key={timer.id} status={timer.status} isEditing={editingTimer === timer.id}>
                        <TimerDisplay
                            duration={timer.duration}
                            maxDuration={timer.type === 'stopwatch' ? timer.maxDuration : 
                                      timer.type === 'countdown' ? timer.initialDuration : undefined}
                            status={timer.status}
                            onDelete={() => removeTimer(timer.id)}
                            onComplete={fastForward}
                            timerType={timer.type.toUpperCase()}
                        />
                        
                        {editingTimer === timer.id && (
                            <EditForm onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const updates: Partial<Timer> = {};

                                const description = formData.get('description');
                                if (description !== null) {
                                    updates.description = description as string;
                                }

                                switch (timer.type) {
                                    case 'stopwatch': {
                                        const maxDuration = formData.get('maxDuration');
                                        if (maxDuration) {
                                            (updates as Partial<StopwatchTimer>).maxDuration = Number.parseInt(maxDuration as string, 10) * 1000;
                                        }
                                        break;
                                    }
                                    case 'countdown': {
                                        const initialDuration = formData.get('initialDuration');
                                        if (initialDuration) {
                                            (updates as Partial<CountdownTimer>).initialDuration = Number.parseInt(initialDuration as string, 10) * 1000;
                                        }
                                        break;
                                    }
                                    case 'XY': {
                                        const xyRounds = formData.get('rounds');
                                        const xyWorkTime = formData.get('workTime');
                                        const xyUpdates = updates as Partial<XYTimer>;
                                        if (xyRounds) xyUpdates.rounds = Number.parseInt(xyRounds as string, 10);
                                        if (xyWorkTime) xyUpdates.workTime = Number.parseInt(xyWorkTime as string, 10) * 1000;
                                        break;
                                    }
                                    case 'tabata': {
                                        const tabataRounds = formData.get('rounds');
                                        const tabataWorkTime = formData.get('workTime');
                                        const tabataRestTime = formData.get('restTime');
                                        const tabataUpdates = updates as Partial<TabataTimer>;
                                        if (tabataRounds) tabataUpdates.rounds = Number.parseInt(tabataRounds as string, 10);
                                        if (tabataWorkTime) tabataUpdates.workTime = Number.parseInt(tabataWorkTime as string, 10) * 1000;
                                        if (tabataRestTime) tabataUpdates.restTime = Number.parseInt(tabataRestTime as string, 10) * 1000;
                                        break;
                                    }
                                }

                                updateTimer(timer.id, updates);
                                saveToUrl(); // Update URL with new configuration
                                setEditingTimer(null);
                            }}>
                                <div>
                                    <label>Description</label>
                                    <EditInput
                                        type="text"
                                        name="description"
                                        defaultValue={timer.description}
                                        placeholder="What needs to be done? (e.g., 50 push-ups)"
                                    />
                                </div>

                                {timer.type === 'stopwatch' && (
                                    <div>
                                        <label>Maximum Time (seconds)</label>
                                        <EditInput
                                            type="number"
                                            name="maxDuration"
                                            defaultValue={timer.maxDuration / 1000}
                                            min="1"
                                            required
                                        />
                                    </div>
                                )}

                                {timer.type === 'countdown' && (
                                    <div>
                                        <label>Duration (seconds)</label>
                                        <EditInput
                                            type="number"
                                            name="initialDuration"
                                            defaultValue={timer.initialDuration / 1000}
                                            min="1"
                                            required
                                        />
                                    </div>
                                )}

                                {timer.type === 'XY' && (
                                    <>
                                        <div>
                                            <label>Number of Rounds</label>
                                            <EditInput
                                                type="number"
                                                name="rounds"
                                                defaultValue={timer.rounds}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Work Time (seconds)</label>
                                            <EditInput
                                                type="number"
                                                name="workTime"
                                                defaultValue={timer.workTime / 1000}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {timer.type === 'tabata' && (
                                    <>
                                        <div>
                                            <label>Number of Rounds</label>
                                            <EditInput
                                                type="number"
                                                name="rounds"
                                                defaultValue={timer.rounds}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Work Time (seconds)</label>
                                            <EditInput
                                                type="number"
                                                name="workTime"
                                                defaultValue={timer.workTime / 1000}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Rest Time (seconds)</label>
                                            <EditInput
                                                type="number"
                                                name="restTime"
                                                defaultValue={timer.restTime / 1000}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <EditButtonGroup>
                                    <EditActionButton type="submit" $variant="save">
                                        Save
                                    </EditActionButton>
                                    <EditActionButton 
                                        type="button" 
                                        $variant="cancel"
                                        onClick={() => setEditingTimer(null)}
                                    >
                                        Cancel
                                    </EditActionButton>
                                </EditButtonGroup>
                            </EditForm>
                        )}

                        <ButtonGroup>
                            <MoveButton
                                onClick={() => {
                                    moveTimer(timer.id, 'up');
                                    saveToUrl();
                                }}
                                disabled={index === 0 || timer.status === 'running' || editingTimer === timer.id}
                                title="Move Up"
                            >
                                ↑
                            </MoveButton>
                            <Button 
                                $variant="edit"
                                onClick={() => setEditingTimer(timer.id)}
                                disabled={timer.status === 'running' || editingTimer !== null}
                                data-editing={editingTimer === timer.id}
                            >
                                {editingTimer === timer.id ? 'Editing...' : 'Edit Timer'}
                            </Button>
                            <MoveButton
                                onClick={() => {
                                    moveTimer(timer.id, 'down');
                                    saveToUrl();
                                }}
                                disabled={index === timers.length - 1 || timer.status === 'running' || editingTimer === timer.id}
                                title="Move Down"
                            >
                                ↓
                            </MoveButton>
                        </ButtonGroup>
                    </TimerCard>
                ))}
            </TimersList>

            {/* Main button group */}
            <ButtonGroup>
                <Button onClick={toggleStartPause} disabled={timers.length === 0}>
                    {currentTimerIndex !== null && timers[currentTimerIndex]?.status === 'running' ? 'Pause' : 'Start'}
                </Button>

                <Button onClick={resetTimers} disabled={timers.length === 0}>
                    Reset All
                </Button>

                <Button onClick={fastForward} disabled={currentTimerIndex === null}>
                    Skip Timer
                </Button>

                <Button 
                    $variant="save"
                    onClick={() => {
                        saveToUrl();
                        const notification = document.getElementById('save-notification');
                        if (notification) {
                            notification.classList.add('show');
                            setTimeout(() => {
                                notification.classList.remove('show');
                            }, 3000);
                        }
                    }} 
                    disabled={timers.length === 0}
                >
                    Save Configuration
                </Button>
            </ButtonGroup>

            <Notification id="save-notification">
                Configuration saved to URL! You can now share this URL.
            </Notification>
        </Container>
    );
};

const TimersView = () => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset the timer state when the user clicks "Try again"
                window.location.reload();
            }}
        >
            <TimersContent />
        </ErrorBoundary>
    );
};

export default TimersView;
