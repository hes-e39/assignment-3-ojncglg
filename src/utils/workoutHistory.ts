// This file contains functions for managing workout history in local storage.
// It allows saving, loading, and clearing workout entries.

import type { Timer } from '../TimerContext';

// WorkoutEntry interface defines the structure of a workout entry
export interface WorkoutEntry {
    id: string; // Unique identifier for the workout entry
    date: string; // Date of the workout entry
    timers: Timer[]; // Array of timers associated with the workout
    totalDuration: number; // Total duration of the workout in milliseconds
}

const HISTORY_STORAGE_KEY = 'workout_history'; // Key for storing workout history in local storage

// Function to save a workout entry to history
export const saveWorkoutToHistory = (timers: Timer[]) => {
    try {
        const history = loadWorkoutHistory(); // Load existing history
        const newEntry: WorkoutEntry = {
            id: crypto.randomUUID(), // Generate a unique ID for the new entry
            date: new Date().toISOString(), // Get the current date in ISO format
            timers: timers.map(timer => ({
                ...timer,
                status: 'completed' // Ensure all timers are marked as completed
            })),
            totalDuration: calculateTotalDuration(timers) // Calculate total duration
        };
        
        const updatedHistory = [newEntry, ...history]; // Add new entry to the history
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory)); // Save updated history to local storage
        return newEntry; // Return the new entry
    } catch (err) {
        console.error('Error saving workout to history:', err); // Log any errors
        return null; // Return null in case of error
    }
};

// Function to load workout history from local storage
export const loadWorkoutHistory = (): WorkoutEntry[] => {
    try {
        const historyData = localStorage.getItem(HISTORY_STORAGE_KEY); // Get history data from local storage
        return historyData ? JSON.parse(historyData) : []; // Parse and return history or return an empty array
    } catch (err) {
        console.error('Error loading workout history:', err); // Log any errors
        return []; // Return an empty array in case of error
    }
};

// Function to clear workout history from local storage
export const clearWorkoutHistory = () => {
    try {
        localStorage.removeItem(HISTORY_STORAGE_KEY); // Remove history from local storage
    } catch (err) {
        console.error('Error clearing workout history:', err); // Log any errors
    }
};

// Function to calculate the total duration of timers
const calculateTotalDuration = (timers: Timer[]): number => {
    return timers.reduce((total, timer) => {
        switch (timer.type) {
            case 'stopwatch':
                return total + timer.duration; // Add duration for stopwatch
            case 'countdown':
                return total + timer.initialDuration; // Add initial duration for countdown
            case 'XY':
                return total + (timer.workTime * timer.rounds); // Add total time for XY timer
            case 'tabata':
                return total + ((timer.workTime + timer.restTime) * timer.rounds); // Add total time for tabata timer
            default:
                return total; // Return total if timer type is unknown
        }
    }, 0); // Start with a total of 0
};
