// This component implements the stopwatch functionality.
// It displays the current duration and allows the user to see the time until the maximum duration is reached.

import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { TIMER_CONFIG } from '../../timerConfig';
import { Container, Label, InfoBox } from '../SharedStyles';
import TimerDisplay from './TimerDisplay';
import type { BaseTimerProps } from './types';

type StopwatchProps = BaseTimerProps; // Type definition for Stopwatch props

export default function Stopwatch({ 
    duration, 
    maxDuration = TIMER_CONFIG.STOPWATCH_MAX_TIME, // Default max duration from config
    status, 
    isActive = false, // Indicates if the stopwatch is currently active
    onDelete 
}: StopwatchProps) {
    const { fastForward } = useTimerContext(); // Get fastForward function from TimerContext

    // Check if the maximum time has been reached
    const isMaxTimeReached = duration >= TIMER_CONFIG.STOPWATCH_MAX_TIME;

    // If the maximum time is reached and the stopwatch is running, fast forward
    if (isMaxTimeReached && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="Stopwatch Timer">
            <Label>STOPPPPWATCH</Label>
            <TimerDisplay 
                duration={duration} 
                maxDuration={maxDuration} 
                status={status} 
                onDelete={onDelete}
                timerType="STOPPPPWATCH" 
            />
            {isActive && (
                <InfoBox role="status" aria-live="polite">
                    {duration < maxDuration ? (
                        <span>
                            Time until max: {formatTime(maxDuration - duration)}
                        </span>
                    ) : (
                        <span>Maximum time reached</span>
                    )}
                </InfoBox>
            )}
        </Container>
    );
}
