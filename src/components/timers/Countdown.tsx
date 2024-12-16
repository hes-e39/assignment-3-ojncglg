import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { Container, InfoBox, Label } from '../SharedStyles';
import TimerDisplay from './TimerDisplay';
import { ProgressBar } from './SharedTimerComponents';
import type { BaseTimerProps } from './types';

interface CountdownProps extends Omit<BaseTimerProps, 'maxDuration'> {
    initialDuration: number;
}

export default function Countdown({ duration, initialDuration, status, isActive = false }: CountdownProps) {
    const { fastForward } = useTimerContext();

    const progressPercent = initialDuration > 0 ? Math.floor((duration / initialDuration) * 100) : 0;

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

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
