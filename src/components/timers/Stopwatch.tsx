import React, { useState, useEffect } from 'react';

//Time starts at 0 and not running
//max time is 2 minutes and 30 seconds
const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const MAX_TIME = 150000; // 2 minutes and 30 seconds in milliseconds

//intervalID will hold the interval ID
  useEffect(() => {
    let intervalId: number;
    //Check if the stopwatch is running
    if (isRunning) {
      // if it is start an interval that runs every 10 milliseconds
      intervalId = setInterval(() => {
        setTime(prevTime => {
          // Stop the timer if it reaches MAX_TIME
          if (prevTime + 10 >= MAX_TIME) {
            setIsRunning(false);
            return MAX_TIME;
          }
          return prevTime + 10;
        });
      }, 10);
    }
    //Return a cleanup function
    return () => clearInterval(intervalId);
  }, [isRunning]);

  //Will start and stop the watch
  const handleStartStop = () => {
    //if it is true, make it false, if its false make it true
    setIsRunning(!isRunning);
  };

  // Resets the stopwatch back to zero and stops it
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  // Sets the stopwatch to the maximum time and stops it
  const handleEnd = () => {
    setIsRunning(false);
    setTime(MAX_TIME); // Set time to max when ending
  };

  // Function to format time in MM:SS.mmu format
  const formatTime = (timeInMilliseconds: number): string => {
    // Ensure time doesn't exceed MAX_TIME (2:30)
    //Math your way into minutes, seconds, miliseconds and microseconds
    const clampedTime = Math.min(timeInMilliseconds, MAX_TIME);
    const minutes = Math.floor(clampedTime / 60000);
    const seconds = Math.floor((clampedTime % 60000) / 1000);
    const milliseconds = Math.floor((clampedTime % 1000) / 10);
    const microseconds = clampedTime % 10;
// Combine the results into a string
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}${microseconds}`;
  };

  //////////////////Styles//////////////////
  // This will be used in all of the buttons for all the clocks//
  //DO NOT CHANGE//
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: '#f0f0f0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    time: {
      fontSize: '48px',
      fontWeight: 'bold',
      margin: '20px 0',
      fontFamily: 'monospace',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    startStopButton: {
      backgroundColor: isRunning ? '#ff4136' : '#2ecc40',
      color: 'white',
    },
    resetButton: {
      backgroundColor: '#ffdc00',
      color: 'black',
    },
    endButton: {
      backgroundColor: '#0074d9',
      color: 'white',
    },
  };
///END STYLES?///

//JSX defines the UI of the stopwatch//
  return (
    <div style={styles.container}>
      <div style={styles.time}>{formatTime(time)}</div>
      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, ...styles.startStopButton}} 
          onClick={handleStartStop}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          style={{...styles.button, ...styles.resetButton}} 
          onClick={handleReset}
        >
          Reset
        </button>
        <button 
          style={{...styles.button, ...styles.endButton}} 
          onClick={handleEnd}
        >
          End
        </button>
      </div>
    </div>
  );
};
export default Stopwatch;