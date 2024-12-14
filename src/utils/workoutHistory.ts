import type { Timer } from '../TimerContext';

export interface WorkoutEntry {
    id: string;
    date: string;
    timers: Timer[];
    totalDuration: number;
}

const HISTORY_STORAGE_KEY = 'workout_history';

export const saveWorkoutToHistory = (timers: Timer[]) => {
    try {
        const history = loadWorkoutHistory();
        const newEntry: WorkoutEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            timers: timers.map(timer => ({
                ...timer,
                status: 'completed' // Ensure all timers are marked as completed
            })),
            totalDuration: calculateTotalDuration(timers)
        };
        
        const updatedHistory = [newEntry, ...history];
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        return newEntry;
    } catch (err) {
        console.error('Error saving workout to history:', err);
        return null;
    }
};

export const loadWorkoutHistory = (): WorkoutEntry[] => {
    try {
        const historyData = localStorage.getItem(HISTORY_STORAGE_KEY);
        return historyData ? JSON.parse(historyData) : [];
    } catch (err) {
        console.error('Error loading workout history:', err);
        return [];
    }
};

export const clearWorkoutHistory = () => {
    try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (err) {
        console.error('Error clearing workout history:', err);
    }
};

const calculateTotalDuration = (timers: Timer[]): number => {
    return timers.reduce((total, timer) => {
        switch (timer.type) {
            case 'stopwatch':
                return total + timer.duration;
            case 'countdown':
                return total + timer.initialDuration;
            case 'XY':
                return total + (timer.workTime * timer.rounds);
            case 'tabata':
                return total + ((timer.workTime + timer.restTime) * timer.rounds);
            default:
                return total;
        }
    }, 0);
};
