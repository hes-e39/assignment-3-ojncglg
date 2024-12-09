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
    maxDuration: number;
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
        if (typeof currentTimerIndex !== 'number' || currentTimerIndex >= timers.length) return;

        const index = currentTimerIndex;
        const currentTimer = timers[index];
        if (currentTimer.status !== 'running') return;

        const startTime = performance.now();
        let expectedTime = startTime;
        let animationFrameId: number | null = null;

        function updateTimer(currentTime: number) {
            // Calculate the time that should have elapsed
            const elapsedTime = currentTime - startTime;
            
            // Update timer state
            setTimers(prevTimers => {
                if (index >= prevTimers.length) return prevTimers;
                
                const updatedTimers = [...prevTimers];
                const timer = updatedTimers[index];

                // Calculate actual time change since last update
                const actualElapsed = Math.round(currentTime - expectedTime);
                expectedTime = currentTime;

                switch (timer.type) {
                    case 'stopwatch': {
                        const newDuration = Math.round(elapsedTime);
                        timer.duration = Math.min(newDuration, timer.maxDuration);
                        if (timer.duration >= timer.maxDuration) {
                            timer.status = 'completed';
                        }
                        break;
                    }

                    case 'countdown': {
                        const newDuration = Math.max(0, timer.initialDuration - Math.round(elapsedTime));
                        timer.duration = newDuration;
                        if (timer.duration === 0) {
                            timer.status = 'completed';
                        }
                        break;
                    }

                    case 'XY':
                    case 'tabata': {
                        const newDuration = Math.max(0, timer.duration - actualElapsed);
                        if (newDuration === 0) {
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
                        } else {
                            timer.duration = newDuration;
                        }
                        break;
                    }
                }

                return updatedTimers;
            });

            // Schedule next update if timer is still running
            if (timers[index]?.status === 'running') {
                animationFrameId = window.requestAnimationFrame(updateTimer);
            }
        }

        // Start the animation frame loop
        animationFrameId = window.requestAnimationFrame(updateTimer);

        // Cleanup function
        return () => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, [currentTimerIndex, timers]);

    const addTimer = (timerData: Omit<Timer, 'id'>) => {
        const newTimer = {
            ...timerData,
            id: uuidv4(),
        };
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
                            status: 'not running',
                        };
                    }
                }
            }),
        );
        setCurrentTimerIndex(null);
    };

    const toggleStartPause = () => {
        if (currentTimerIndex === null && timers.length > 0) {
            setCurrentTimerIndex(0);
            setTimers(prev => prev.map((timer, index) => (index === 0 ? { ...timer, status: 'running' } : timer)));
        } else if (currentTimerIndex !== null) {
            setTimers(prev => prev.map((timer, index) => (index === currentTimerIndex ? { ...timer, status: timer.status === 'running' ? 'paused' : 'running' } : timer)));
        }
    };

    const fastForward = () => {
        if (currentTimerIndex === null) return;

        setTimers(prev => prev.map((timer, index) => (index === currentTimerIndex ? { ...timer, status: 'completed' } : timer)));

        const nextIndex = currentTimerIndex + 1;
        if (nextIndex < timers.length) {
            setCurrentTimerIndex(nextIndex);
            setTimers(prev => prev.map((timer, index) => (index === nextIndex ? { ...timer, status: 'running' } : timer)));
        } else {
            setCurrentTimerIndex(null);
        }
    };

    const getTotalTime = () => {
        return timers.reduce((total, timer) => {
            switch (timer.type) {
                case 'stopwatch':
                    return total;
                case 'countdown':
                    return total + timer.initialDuration;
                case 'XY':
                    return total + timer.workTime * timer.rounds;
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
