import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// The BaseTimer interface defines properties that all timer types must have.
// This creates a consistent foundation for our timer system.
interface BaseTimer {
    id: string;
    type: 'stopwatch' | 'countdown' | 'XY' | 'tabata';
    status: 'not running' | 'running' | 'paused' | 'completed';
}

// Each specific timer type extends BaseTimer and adds its own unique properties.
// Stopwatch is the simplest, only needing duration to track elapsed time.
export interface StopwatchTimer extends BaseTimer {
    type: 'stopwatch';
    duration: number;
}

// Countdown needs both current and initial duration to handle resets properly.
export interface CountdownTimer extends BaseTimer {
    type: 'countdown';
    duration: number;
    initialDuration: number;
}

// XY timer tracks work intervals only, with rounds for repetition.
export interface XYTimer extends BaseTimer {
    type: 'XY';
    rounds: number;
    currentRound: number;
    workTime: number;
    isWorking: boolean;
    duration: number;
}

// Tabata includes both work and rest intervals in its cycle.
export interface TabataTimer extends BaseTimer {
    type: 'tabata';
    rounds: number;
    currentRound: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    duration: number;
}

// Timer type combines all possible timer types into one type using a union.
export type Timer = StopwatchTimer | CountdownTimer | XYTimer | TabataTimer;

// TimerContextType defines all the operations our timer system supports.
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

// Create the context with undefined as initial value.
export const TimerContext = createContext<TimerContextType | undefined>(undefined);

// The TimerProvider component manages the global state of our timer system.
export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(null);

    // This effect handles the timing logic for the active timer.
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
                    case 'stopwatch': {
                        timer.duration += 10;
                        break;
                    }

                    case 'countdown': {
                        timer.duration = Math.max(0, timer.duration - 10);
                        if (timer.duration === 0) {
                            timer.status = 'completed';
                        }
                        break;
                    }

                    case 'XY':
                    case 'tabata': {
                        timer.duration = Math.max(0, timer.duration - 10);
                        if (timer.duration === 0) {
                            if (timer.isWorking) {
                                timer.isWorking = false;
                                timer.duration = timer.type === 'tabata' ? timer.restTime : timer.workTime;
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
                }

                return updatedTimers;
            });
        }, 10);

        return () => clearTimeout(timeoutId);
    }, [currentTimerIndex, timers]);

    // Adds a new timer to the list and generates a unique ID for it.
    const addTimer = (timerData: Omit<Timer, 'id'>) => {
        const newTimer = {
            ...timerData,
            id: uuidv4()
        } as Timer;
        setTimers(prev => [...prev, newTimer]);
    };

    // Removes a timer by ID and handles the case where the active timer is removed.
    const removeTimer = (id: string) => {
        setTimers(prev => prev.filter(timer => timer.id !== id));
        if (currentTimerIndex !== null) {
            setCurrentTimerIndex(prev => 
                prev !== null && timers[prev].id === id 
                    ? null 
                    : prev
            );
        }
    };

    // Resets all timers to their initial state.
    const resetTimers = () => {
        setTimers(prev => prev.map(timer => {
            switch (timer.type) {
                case 'stopwatch': {
                    return { ...timer, duration: 0, status: 'not running' };
                }
                case 'countdown': {
                    return { ...timer, duration: timer.initialDuration, status: 'not running' };
                }
                case 'XY':
                case 'tabata': {
                    return {
                        ...timer,
                        duration: timer.workTime,
                        currentRound: 1,
                        isWorking: true,
                        status: 'not running'
                    };
                }
            }
        }));
        setCurrentTimerIndex(null);
    };

    // Toggles the running state of the current timer.
    const toggleStartPause = () => {
        if (currentTimerIndex === null && timers.length > 0) {
            setCurrentTimerIndex(0);
            setTimers(prev => prev.map((timer, index) => 
                index === 0 ? { ...timer, status: 'running' } : timer
            ));
        } else if (currentTimerIndex !== null) {
            setTimers(prev => prev.map((timer, index) => 
                index === currentTimerIndex 
                    ? { ...timer, status: timer.status === 'running' ? 'paused' : 'running' }
                    : timer
            ));
        }
    };

    // Completes the current timer and moves to the next one.
    const fastForward = () => {
        if (currentTimerIndex === null) return;

        setTimers(prev => prev.map((timer, index) => 
            index === currentTimerIndex 
                ? { ...timer, status: 'completed' }
                : timer
        ));

        const nextIndex = currentTimerIndex + 1;
        if (nextIndex < timers.length) {
            setCurrentTimerIndex(nextIndex);
            setTimers(prev => prev.map((timer, index) => 
                index === nextIndex 
                    ? { ...timer, status: 'running' }
                    : timer
            ));
        } else {
            setCurrentTimerIndex(null);
        }
    };

    // Calculates the total time for all timers.
    const getTotalTime = () => {
        return timers.reduce((total, timer) => {
            switch (timer.type) {
                case 'stopwatch':
                    return total;  // Stopwatch doesn't contribute to total time
                case 'countdown':
                    return total + timer.initialDuration;
                case 'XY':
                    return total + (timer.workTime * timer.rounds);
                case 'tabata':
                    return total + ((timer.workTime + timer.restTime) * timer.rounds);
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
                getTotalTime
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

// Custom hook to use the timer context, with proper error handling.
export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
};