import type { Timer } from '../TimerContext';

interface SharedTimerBase {
    type: 'stopwatch' | 'countdown' | 'XY' | 'tabata';
    description: string;
}

interface SharedStopwatch extends SharedTimerBase {
    type: 'stopwatch';
    maxDuration: number;
}

interface SharedCountdown extends SharedTimerBase {
    type: 'countdown';
    initialDuration: number;
}

interface SharedXY extends SharedTimerBase {
    type: 'XY';
    rounds: number;
    workTime: number;
}

interface SharedTabata extends SharedTimerBase {
    type: 'tabata';
    rounds: number;
    workTime: number;
    restTime: number;
}

type SharedTimer = SharedStopwatch | SharedCountdown | SharedXY | SharedTabata;

interface SharedState {
    timers: Timer[];
}

export function updateUrlWithState(state: SharedState) {
    try {
        const url = new URL(window.location.href);
        // Only share timer configurations, not runtime state
        const shareableTimers = state.timers.map(timer => {
            const base = {
                type: timer.type,
                description: timer.description
            };

            switch (timer.type) {
                case 'stopwatch':
                    return {
                        ...base,
                        maxDuration: timer.maxDuration
                    };
                case 'countdown':
                    return {
                        ...base,
                        initialDuration: timer.initialDuration
                    };
                case 'XY':
                    return {
                        ...base,
                        rounds: timer.rounds,
                        workTime: timer.workTime
                    };
                case 'tabata':
                    return {
                        ...base,
                        rounds: timer.rounds,
                        workTime: timer.workTime,
                        restTime: timer.restTime
                    };
            }
        });

        url.searchParams.set('timers', JSON.stringify(shareableTimers));
        window.history.pushState({}, '', url);
    } catch (err) {
        console.error('Error updating URL state:', err);
    }
}

export function getStateFromUrl(): SharedState | null {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const timersJson = urlParams.get('timers');
        if (!timersJson) return null;

        const parsedTimers = JSON.parse(timersJson) as SharedTimer[];
        
        // Convert shared config back to full timer objects
        const timers = parsedTimers.map((timer) => {
            const base = {
                id: crypto.randomUUID(),
                status: 'not running' as const,
                description: timer.description,
                type: timer.type
            };

            switch (timer.type) {
                case 'stopwatch':
                    return {
                        ...base,
                        type: 'stopwatch' as const,
                        duration: 0,
                        maxDuration: timer.maxDuration
                    };
                case 'countdown':
                    return {
                        ...base,
                        type: 'countdown' as const,
                        duration: timer.initialDuration,
                        initialDuration: timer.initialDuration
                    };
                case 'XY':
                    return {
                        ...base,
                        type: 'XY' as const,
                        rounds: timer.rounds,
                        currentRound: 1,
                        workTime: timer.workTime,
                        isWorking: true,
                        duration: timer.workTime
                    };
                case 'tabata':
                    return {
                        ...base,
                        type: 'tabata' as const,
                        rounds: timer.rounds,
                        currentRound: 1,
                        workTime: timer.workTime,
                        restTime: timer.restTime,
                        isWorking: true,
                        duration: timer.workTime
                    };
            }
        });

        return { timers };
    } catch (err) {
        console.error('Error parsing URL state:', err);
        return null;
    }
}
