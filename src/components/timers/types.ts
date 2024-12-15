export type TimerStatus = 'not running' | 'running' | 'paused' | 'completed';

export interface BaseTimerProps {
    duration: number;
    maxDuration?: number;  // Making maxDuration optional
    status: TimerStatus;
    isActive?: boolean;
    onDelete?: () => void;
}

export interface ProgressBarProps {
    percent: number;
    label?: string;
    showLabel?: boolean;
}
