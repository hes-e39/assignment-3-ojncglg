const TIMER_CONFIG_KEY = 'workout_timer_config';
const TIMER_STATE_KEY = 'workout_timer_state';

interface TimerConfig {
    id: string;
    type: 'stopwatch' | 'countdown' | 'XY' | 'tabata';
    description: string;
    duration?: number;
    initialDuration?: number;
    maxDuration?: number;
    rounds?: number;
    workTime?: number;
    restTime?: number;
}

interface StoredTimerState {
    currentTimerIndex: number | null;
    timers: Array<{
        id: string;
        status: 'not running' | 'running' | 'paused' | 'completed';
        duration: number;
        currentRound?: number;
        isWorking?: boolean;
    }>;
}

// Save timer configurations
export function saveTimerConfig(timers: TimerConfig[]) {
    try {
        const configToSave = timers.map(timer => ({
            id: timer.id,
            type: timer.type,
            description: timer.description,
            ...(timer.type === 'countdown' && { initialDuration: timer.initialDuration }),
            ...(timer.type === 'stopwatch' && { maxDuration: timer.maxDuration }),
            ...(timer.type === 'XY' && { 
                rounds: timer.rounds,
                workTime: timer.workTime 
            }),
            ...(timer.type === 'tabata' && {
                rounds: timer.rounds,
                workTime: timer.workTime,
                restTime: timer.restTime
            })
        }));
        localStorage.setItem(TIMER_CONFIG_KEY, JSON.stringify(configToSave));
    } catch (error) {
        console.error('Error saving timer config:', error);
    }
}

// Save runtime state
export function saveTimerState(state: StoredTimerState) {
    try {
        localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving timer state:', error);
    }
}

// Load timer configurations
export function loadTimerConfig() {
    try {
        const saved = localStorage.getItem(TIMER_CONFIG_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading timer config:', error);
        return null;
    }
}

// Load runtime state
export function loadTimerState() {
    try {
        const saved = localStorage.getItem(TIMER_STATE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading timer state:', error);
        return null;
    }
}

// Clear all stored timer data
export function clearTimerStorage() {
    try {
        localStorage.removeItem(TIMER_CONFIG_KEY);
        localStorage.removeItem(TIMER_STATE_KEY);
    } catch (error) {
        console.error('Error clearing timer storage:', error);
    }
}
