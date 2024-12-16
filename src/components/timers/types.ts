// This file contains type definitions and interfaces related to timer functionalities.

// TimerStatus type defines the possible states of a timer
export type TimerStatus = 'not running' | 'running' | 'paused' | 'completed';

// BaseTimerProps interface defines the common properties for timer components
export interface BaseTimerProps {
    duration: number; // Current duration of the timer in milliseconds
    maxDuration?: number;  // Maximum duration of the timer in milliseconds (optional)
    status: TimerStatus; // Current status of the timer
    isActive?: boolean; // Indicates if the timer is currently active (optional)
    onDelete?: () => void; // Callback function to delete the timer (optional)
}

// ProgressBarProps interface defines the properties for the ProgressBar component
export interface ProgressBarProps {
    percent: number; // Current progress percentage
    label?: string; // Optional label to display on the progress bar
    showLabel?: boolean; // Flag to determine if the label should be shown (optional)
}
