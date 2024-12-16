import type { Timer } from '../TimerContext';

interface StoredTimerState {
    timers: Timer[];
    currentTimerIndex: number | null;
}

const STORAGE_KEY = 'workout_app_state';

export const saveToLocalStorage = (state: StoredTimerState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
        console.error('Error saving state to localStorage:', err);
    }
};

export const loadFromLocalStorage = (): StoredTimerState | null => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (!serializedState) return null;
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading state from localStorage:', err);
        return null;
    }
};

export const clearLocalStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error('Error clearing localStorage:', err);
    }
};
