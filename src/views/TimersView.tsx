import styled from 'styled-components';
import { useTimerContext } from '../TimerContext';
import type { Timer } from '../TimerContext';

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

const TimerCard = styled.div<{ status: Timer['status'] }>`
  background: #000;
  border: 2px solid ${({ status }) => {
      switch (status) {
          case 'running':
              return '#2ecc40';
          case 'paused':
              return '#ff851b';
          case 'completed':
              return '#ff4136';
          default:
              return '#ffd700';
      }
  }};
  border-radius: 8px;
  padding: 20px;
  position: relative;
`;

const TimerDisplay = styled.div`
  font-size: 2.5rem;
  font-family: 'Digital-7', monospace;
  text-align: center;
  color: #ffd700;
  margin: 10px 0;
`;

const TimerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TimerTitle = styled.h3`
  color: #ffd700;
  margin: 0;
`;

const TimerStatus = styled.span<{ status: Timer['status'] }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${({ status }) => {
      switch (status) {
          case 'running':
              return '#2ecc40';
          case 'paused':
              return '#ff851b';
          case 'completed':
              return '#ff4136';
          default:
              return '#666';
      }
  }};
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  background: #ffd700;
  color: #000;
  cursor: pointer;
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

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #ff4136;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;

  &:hover {
    color: #ff725c;
  }
`;

const TotalTime = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  margin: 20px 0;
`;

// ------------------- Helper Functions -------------------

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

const getTimerDescription = (timer: Timer): string => {
    switch (timer.type) {
        case 'stopwatch':
            return 'Count up to 2:30';
        case 'countdown':
            return `Count down from ${formatTime(timer.initialDuration)}`;
        case 'XY':
            return `${timer.rounds} rounds of ${formatTime(timer.workTime)} work / ${formatTime(timer.restTime)} rest`;
        case 'tabata':
            return `${timer.rounds} rounds of ${formatTime(timer.workTime)} work / ${formatTime(timer.restTime)} rest`;
        default:
            return '';
    }
};

// ------------------- TimersView Component -------------------

const TimersView = () => {
    const { timers, currentTimerIndex, toggleStartPause, fastForward, resetTimers, removeTimer, getTotalTime } = useTimerContext();

    const renderTimerDetails = (timer: Timer, isActive: boolean) => {
        if (!isActive) {
            return <div>{getTimerDescription(timer)}</div>;
        }

        switch (timer.type) {
            case 'stopwatch':
                return <div>Time: {formatTime(timer.duration)}</div>;

            case 'countdown':
                return <div>Remaining: {formatTime(timer.duration)}</div>;

            case 'XY':
            case 'tabata':
                return (
                    <div>
                        <div>
                            Round: {timer.currentRound}/{timer.rounds}
                        </div>
                        <div>
                            {timer.isWorking ? 'Work' : 'Rest'}: {formatTime(timer.duration)}
                        </div>
                    </div>
                );
        }
    };

    return (
        <Container>
            <h2>Workout Timers</h2>

            <TotalTime>Total Workout Time: {formatTime(getTotalTime())}</TotalTime>

            <TimersList>
                {timers.map((timer, index) => (
                    <TimerCard key={timer.id} status={timer.status}>
                        <RemoveButton onClick={() => removeTimer(timer.id)} disabled={timer.status === 'running'}>
                            ×
                        </RemoveButton>

                        <TimerInfo>
                            <TimerTitle>{timer.type.toUpperCase()}</TimerTitle>
                            <TimerStatus status={timer.status}>{timer.status.toUpperCase()}</TimerStatus>
                        </TimerInfo>

                        <TimerDisplay>{renderTimerDetails(timer, index === currentTimerIndex)}</TimerDisplay>
                    </TimerCard>
                ))}
            </TimersList>

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
            </ButtonGroup>
        </Container>
    );
};

export default TimersView;
