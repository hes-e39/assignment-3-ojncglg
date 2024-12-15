import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { TIMER_CONFIG } from '../../timerConfig';
import { Container, Label, InfoBox } from '../SharedStyles';
import TimerDisplay from './TimerDisplay';
import type { BaseTimerProps } from './types';

type StopwatchProps = BaseTimerProps;

export default function Stopwatch({ 
    duration, 
    maxDuration = TIMER_CONFIG.STOPWATCH_MAX_TIME, 
    status, 
    isActive = false, 
    onDelete 
}: StopwatchProps) {
    const { fastForward } = useTimerContext();

    const isMaxTimeReached = duration >= TIMER_CONFIG.STOPWATCH_MAX_TIME;

    if (isMaxTimeReached && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="Stopwatch Timer">
            <Label>STOPWATCH</Label>
            <TimerDisplay duration={duration} maxDuration={maxDuration} status={status} onDelete={onDelete} />
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
