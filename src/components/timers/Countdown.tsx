// This component implements the countdown timer functionality.
// It displays the current duration and provides visual feedback on the remaining time.

import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { Container, InfoBox, Label } from '../SharedStyles';
import TimerDisplay from './TimerDisplay';
import { ProgressBar } from './SharedTimerComponents';
import type { BaseTimerProps } from './types';

// Props interface for the Countdown component
interface CountdownProps extends Omit<BaseTimerProps, 'maxDuration'> {
    initialDuration: number; // Initial duration for the countdown in milliseconds
}

// Countdown component definition
export default function Countdown({ duration, initialDuration, status, isActive = false }: CountdownProps) {
    const { fastForward } = useTimerContext(); // Get fastForward function from TimerContext

    // Calculate the progress percentage based on the initial duration
    const progressPercent = initialDuration > 0 ? Math.floor((duration / initialDuration) * 100) : 0;

    // If the duration reaches zero and the countdown is running, fast forward
    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    // Function to render time information based on the active state
    const renderTimeInfo = () => {
        if (!isActive) return null;
        return <InfoBox>{duration > 0 ? <span>Initial Time: {formatTime(initialDuration)}</span> : <span>Time's up!</span>}</InfoBox>;
    };

    return (
        <Container role="timer" aria-label="Countdown Timer">
            <Label>COUNTDOWN</Label>
            <TimerDisplay duration={duration} maxDuration={initialDuration} status={status} timerType="COUNTDOWN" />
            {isActive && <ProgressBar percent={progressPercent} label={`${Math.max(0, progressPercent)}% Remaining`} />}
            {renderTimeInfo()}
        </Container>
    );
}
