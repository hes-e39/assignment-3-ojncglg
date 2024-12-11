import { useTimerContext } from '../../TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { Container, InfoBox, Label, StatusBadge, TimeDisplay } from '../SharedStyles';
import { TimerProgress, TimerSummary, TimerInfo } from './SharedTimerComponents';

// ------------------- Component Interface -------------------

interface TabataProps {
    duration: number;
    currentRound: number;
    rounds: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    status: 'not running' | 'running' | 'paused' | 'completed';
    isActive?: boolean;
}

// ------------------- Tabata Timer Component -------------------

export default function Tabata({ duration, currentRound, rounds, workTime, restTime, isWorking, status, isActive = false }: TabataProps) {
    const { fastForward } = useTimerContext();

    // Calculate remaining time for the entire workout
    const remainingRounds = rounds - currentRound + 1;
    const remainingTime = duration + (remainingRounds - 1) * (workTime + restTime) + (isWorking ? restTime : 0);

    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    return (
        <Container role="timer" aria-label="Tabata Timer">
            <Label>TABATA</Label>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
            <StatusBadge status={status}>{status}</StatusBadge>
            {isActive ? (
                <>
                    <TimerProgress
                        currentRound={currentRound}
                        rounds={rounds}
                        duration={duration}
                        isWorking={isWorking}
                        workTime={workTime}
                        restTime={restTime}
                    />
                    <TimerInfo>
                        <InfoBox>Remaining: {formatTime(remainingTime)}</InfoBox>
                    </TimerInfo>
                </>
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
