import { useTimerContext } from '../../TimerContext';
import type { Timer } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { Container, Label, StatusBadge, TimeDisplay } from '../SharedStyles';
import { TimerProgress, TimerSummary } from './SharedTimerComponents';

// ------------------- Component Interface -------------------

interface XYProps {
    duration: number;
    currentRound: number;
    rounds: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    status: Timer['status'];
    isActive?: boolean;
}

// ------------------- XY Timer Component -------------------

export default function XY({ duration, currentRound, rounds, workTime, restTime, isWorking, status, isActive = false }: XYProps) {
    const { fastForward } = useTimerContext();

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="XY Timer">
            <Label>XY TIMER</Label>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
            {isActive ? (
                <TimerProgress
                    currentRound={currentRound}
                    rounds={rounds}
                    duration={duration}
                    isWorking={isWorking}
                    workTime={workTime}
                    restTime={restTime}
                />
            ) : (
                <TimerSummary 
                    rounds={rounds} 
                    workTime={workTime} 
                    restTime={restTime} 
                    totalTime={(workTime + restTime) * rounds} 
                />
            )}
        </Container>
    );
}
