import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Base timer configuration
interface BaseTimer {
  id: string;
  type: 'stopwatch' | 'countdown' | 'XY' | 'tabata';
  status: 'not running' | 'running' | 'paused' | 'completed';
}

// Specific timer configurations
export interface StopwatchTimer extends BaseTimer {
  type: 'stopwatch';
  duration: number;
}

export interface CountdownTimer extends BaseTimer {
  type: 'countdown';
  duration: number;
  initialDuration: number;
}

export interface XYTimer extends BaseTimer {
  type: 'XY';
  rounds: number;
  currentRound: number;
  workTime: number;
  restTime: number;
  isWorking: boolean;
  duration: number;
}

export interface TabataTimer extends BaseTimer {
  type: 'tabata';
  rounds: number;
  currentRound: number;
  workTime: number;
  restTime: number;
  isWorking: boolean;
  duration: number;
}

export type Timer = StopwatchTimer | CountdownTimer | XYTimer | TabataTimer;

export type TimerContextType = {
  timers: Timer[];
  currentTimerIndex: number | null;
  toggleStartPause: () => void;
  fastForward: () => void;
  addTimer: (timer: Omit<Timer, 'id'>) => void;
  removeTimer: (id: string) => void;
  resetTimers: () => void;
  getTotalTime: () => number;
};

export const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (currentTimerIndex === null) return;

    const currentTimer = timers[currentTimerIndex];
    if (currentTimer?.status !== 'running') return;

    const timeoutId = setTimeout(() => {
      setTimers(prevTimers => {
        const updatedTimers = [...prevTimers];
        const timer = updatedTimers[currentTimerIndex];

        if (!timer) return prevTimers;

        switch (timer.type) {
          case 'stopwatch':
            timer.duration += 10;
            break;

          case 'countdown':
            timer.duration = Math.max(0, timer.duration - 10);
            if (timer.duration === 0) {
              timer.status = 'completed';
            }
            break;

          case 'XY':
          case 'tabata':
            timer.duration = Math.max(0, timer.duration - 10);
            if (timer.duration === 0) {
              if (timer.isWorking) {
                timer.isWorking = false;
                timer.duration = timer.restTime;
              } else {
                timer.currentRound++;
                if (timer.currentRound > timer.rounds) {
                  timer.status = 'completed';
                } else {
                  timer.isWorking = true;
                  timer.duration = timer.workTime;
                }
              }
            }
            break;
        }

        return updatedTimers;
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [currentTimerIndex, timers]);

  const addTimer = (timerData: Omit<Timer, 'id'>) => {
    if (!('type' in timerData)) {
      throw new Error('Timer must have a type');
    }

    const newTimer = {
      ...timerData,
      id: uuidv4(),
    };

    switch (timerData.type) {
      case 'stopwatch':
        if (!('duration' in newTimer)) {
          (newTimer as StopwatchTimer).duration = 0;
        }
        break;
      case 'countdown':
        if (!('initialDuration' in newTimer)) {
          throw new Error('Countdown timer must have initialDuration');
        }
        break;
      case 'XY':
      case 'tabata':
        if (
          !('rounds' in newTimer) ||
          !('currentRound' in newTimer) ||
          !('workTime' in newTimer) ||
          !('restTime' in newTimer) ||
          !('isWorking' in newTimer)
        ) {
          throw new Error(`${timerData.type} timer missing required properties`);
        }
        break;
    }

    setTimers(prev => [...prev, newTimer as Timer]);
  };

  const removeTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
    if (currentTimerIndex !== null) {
      setCurrentTimerIndex(prev => (prev !== null && timers[prev].id === id ? null : prev));
    }
  };

  const resetTimers = () => {
    setTimers(prev =>
      prev.map(timer => {
        switch (timer.type) {
          case 'stopwatch':
            return { ...timer, duration: 0, status: 'not running' };
          case 'countdown':
            return { ...timer, duration: timer.initialDuration, status: 'not running' };
          case 'XY':
          case 'tabata':
            return {
              ...timer,
              duration: timer.workTime,
              currentRound: 1,
              isWorking: true,
              status: 'not running',
            };
        }
      })
    );
    setCurrentTimerIndex(null);
  };

  const toggleStartPause = () => {
    if (currentTimerIndex === null && timers.length > 0) {
      setCurrentTimerIndex(0);
      setTimers(prev =>
        prev.map((timer, index) =>
          index === 0 ? { ...timer, status: 'running' } : timer
        )
      );
    } else if (currentTimerIndex !== null) {
      setTimers(prev =>
        prev.map((timer, index) =>
          index === currentTimerIndex
            ? { ...timer, status: timer.status === 'running' ? 'paused' : 'running' }
            : timer
        )
      );
    }
  };

  const fastForward = () => {
    if (currentTimerIndex === null) return;

    setTimers(prev =>
      prev.map((timer, index) =>
        index === currentTimerIndex ? { ...timer, status: 'completed' } : timer
      )
    );

    const nextIndex = currentTimerIndex + 1;
    if (nextIndex < timers.length) {
      setCurrentTimerIndex(nextIndex);
      setTimers(prev =>
        prev.map((timer, index) =>
          index === nextIndex ? { ...timer, status: 'running' } : timer
        )
      );
    } else {
      setCurrentTimerIndex(null);
    }
  };

  const getTotalTime = () => {
    return timers.reduce((total, timer) => {
      switch (timer.type) {
        case 'stopwatch':
          return total; // Skip stopwatch duration
        case 'countdown':
          return total + timer.initialDuration;
        case 'XY':
        case 'tabata':
          return total + (timer.workTime + timer.restTime) * timer.rounds;
      }
    }, 0);
  };

  return (
    <TimerContext.Provider
      value={{
        timers,
        currentTimerIndex,
        toggleStartPause,
        fastForward,
        addTimer,
        removeTimer,
        resetTimers,
        getTotalTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
