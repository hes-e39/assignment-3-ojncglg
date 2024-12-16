// This component displays the workout history, showing details of each workout entry.
// It retrieves workout data from local storage and formats it for display.

import styled from 'styled-components';
import { loadWorkoutHistory, type WorkoutEntry } from '../utils/workoutHistory';
import { formatTime } from '../utils/timeUtils';
import { useEffect, useState } from 'react';

// Styled container for the history view
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

// Styled card for each workout entry
const WorkoutCard = styled.div`
  background-color: #000;
  border-radius: 8px;
  padding: 20px;
  color: #ffd700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Styled header for the workout card
const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
`;

// Styled components for displaying workout date and duration
const WorkoutDate = styled.span`
  font-size: 1.1rem;
  color: #ffa500;
`;

const WorkoutDuration = styled.span`
  font-size: 1.1rem;
  color: #ffa500;
`;

// Styled list for timers within a workout
const TimerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Styled item for each timer
const TimerItem = styled.div`
  background-color: #111;
  padding: 10px;
  border-radius: 4px;
`;

// Styled header for timer details
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

// Styled component for displaying no workouts message
const NoWorkouts = styled.div`
  text-align: center;
  color: #ffa500;
  font-size: 1.2rem;
  margin-top: 40px;
`;

// Function to format the date string into a readable format
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

// Function to get a summary of the timer details
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

// HistoryView component definition
const HistoryView = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]); // State to hold workout entries

  useEffect(() => {
    setWorkouts(loadWorkoutHistory()); // Load workout history on component mount
  }, []);

  // Render message if no workouts are available
  if (workouts.length === 0) {
    return (
      <Container>
        <NoWorkouts>No workout history available</NoWorkouts>
      </Container>
    );
  }

  // Render the list of workouts
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
