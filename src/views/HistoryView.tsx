import styled from 'styled-components';
import { loadWorkoutHistory, type WorkoutEntry } from '../utils/workoutHistory';
import { formatTime } from '../utils/timeUtils';
import { useEffect, useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const WorkoutCard = styled.div`
  background-color: #000;
  border-radius: 8px;
  padding: 20px;
  color: #ffd700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
`;

const WorkoutDate = styled.span`
  font-size: 1.1rem;
  color: #ffa500;
`;

const WorkoutDuration = styled.span`
  font-size: 1.1rem;
  color: #ffa500;
`;

const TimerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimerItem = styled.div`
  background-color: #111;
  padding: 10px;
  border-radius: 4px;
`;

const TimerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const TimerType = styled.span`
  color: #fff;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const TimerDescription = styled.p`
  color: #ccc;
  margin: 5px 0;
  font-size: 0.9rem;
`;

const TimerDetails = styled.div`
  color: #ffd700;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const NoWorkouts = styled.div`
  text-align: center;
  color: #ffa500;
  font-size: 1.2rem;
  margin-top: 40px;
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTimerSummary = (timer: WorkoutEntry['timers'][0]): string => {
  switch (timer.type) {
    case 'stopwatch':
      return `Duration: ${formatTime(timer.duration)}`;
    case 'countdown':
      return `Duration: ${formatTime(timer.initialDuration)}`;
    case 'XY':
      return `${timer.rounds} rounds × ${formatTime(timer.workTime)} work`;
    case 'tabata':
      return `${timer.rounds} rounds × (${formatTime(timer.workTime)} work / ${formatTime(timer.restTime)} rest)`;
    default:
      return '';
  }
};

const HistoryView = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);

  useEffect(() => {
    setWorkouts(loadWorkoutHistory());
  }, []);

  if (workouts.length === 0) {
    return (
      <Container>
        <NoWorkouts>No workout history available</NoWorkouts>
      </Container>
    );
  }

  return (
    <Container>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id}>
          <WorkoutHeader>
            <WorkoutDate>{formatDate(workout.date)}</WorkoutDate>
            <WorkoutDuration>Total: {formatTime(workout.totalDuration)}</WorkoutDuration>
          </WorkoutHeader>
          <TimerList>
            {workout.timers.map((timer, index) => (
              <TimerItem key={`${workout.id}-${index}`}>
                <TimerHeader>
                  <TimerType>{timer.type}</TimerType>
                </TimerHeader>
                <TimerDescription>{timer.description}</TimerDescription>
                <TimerDetails>{getTimerSummary(timer)}</TimerDetails>
              </TimerItem>
            ))}
          </TimerList>
        </WorkoutCard>
      ))}
    </Container>
  );
};

export default HistoryView;
