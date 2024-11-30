import React, { useState, useEffect } from 'react';

const Tabata: React.FC = () => {
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(8);
  
  const [time, setTime] = useState(0);
  const [round, setRound] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [countdown, setCountdown] = useState(3);

  const getBackgroundColor = () => {
    if (isConfiguring || !isRunning) return '#f0f0f0'; // Gray
    if (countdown > 0) return '#FFA500'; // Orange for countdown
    if (isWorking) return '#90EE90'; // Green
    return '#ffff00'; // Yellow for rest period
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: getBackgroundColor(),
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s',
    },
    time: {
      fontSize: '48px',
      fontWeight: 'bold',
      margin: '20px 0',
      fontFamily: 'monospace',
    },
    info: {
      fontSize: '24px',
      marginBottom: '20px',
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
    input: {
      margin: '5px',
      padding: '5px',
      width: '50px',
    },
  };

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      if (countdown > 0) {
        intervalId = setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        intervalId = setInterval(() => {
          setTime(prevTime => {
            const newTime = prevTime + 10;
            if ((isWorking && newTime >= workTime * 1000) || (!isWorking && newTime >= restTime * 1000)) {
              if (isWorking) {
                setIsWorking(false);
                setCountdown(3);
                return 0;
              } else {
                if (round < rounds) {
                  setRound(prevRound => prevRound + 1);
                  setIsWorking(true);
                  setCountdown(3);
                  return 0;
                } else {
                  setIsRunning(false);
                  return newTime;
                }
              }
            }
            return newTime;
          });
        }, 10);
      }
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isWorking, workTime, restTime, round, rounds, countdown]);

  const handleStartStop = () => {
    if (isConfiguring) {
      setIsConfiguring(false);
      setTime(0);
      setCountdown(3);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setRound(1);
    setIsWorking(true);
    setIsRunning(false);
    setIsConfiguring(true);
    setCountdown(3);
  };

  const handleEnd = () => {
    setIsRunning(false);
    setTime(workTime * 1000);
    setRound(rounds);
    setIsWorking(false);
    setCountdown(3);
  };

  const formatTime = (timeInMilliseconds: number): string => {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);
    const microseconds = timeInMilliseconds % 10;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}${microseconds}`;
  };

  return (
    <div style={styles.container}>
      {isConfiguring ? (
        <div>
          <div>
            Work Time (seconds): 
            <input 
              style={styles.input}
              type="number" 
              value={workTime} 
              onChange={(e) => setWorkTime(Math.max(1, parseInt(e.target.value) || 0))} 
            />
          </div>
          <div>
            Rest Time (seconds): 
            <input 
              style={styles.input}
              type="number" 
              value={restTime} 
              onChange={(e) => setRestTime(Math.max(1, parseInt(e.target.value) || 0))} 
            />
          </div>
          <div>
            Number of Rounds: 
            <input 
              style={styles.input}
              type="number" 
              value={rounds} 
              onChange={(e) => setRounds(Math.max(1, parseInt(e.target.value) || 0))} 
            />
          </div>
        </div>
      ) : (
        <>
          {countdown > 0 ? (
            <div style={{...styles.time, fontSize: '72px'}}>{countdown}</div>
          ) : (
            <>
              <div style={styles.time}>{formatTime(time)}</div>
              <div style={styles.info}>
                Round: {round}/{rounds} - {isWorking ? 'Work' : 'Rest'}
              </div>
            </>
          )}
        </>
      )}
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

export default Tabata;