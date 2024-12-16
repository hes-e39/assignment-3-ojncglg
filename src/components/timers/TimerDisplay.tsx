import { formatTime } from '../../utils/timeUtils';
import { 
    TimeDisplayContainer, 
    TimeDisplay as StyledTimeDisplay, 
    TimeRemaining, 
    ButtonContainer,
    TimerHeader,
    TimerType,
    DeleteButton,
    CompleteButton,
    StatusIndicator
} from '../SharedStyles';
import { ProgressBar } from './SharedTimerComponents';
import type { TimerStatus } from './types';

interface TimerDisplayProps {
    duration: number;
    maxDuration?: number;
    status: TimerStatus;
    onDelete?: () => void;
    onComplete?: () => void;
    timerType?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
    duration, 
    maxDuration, 
    status, 
    onDelete, 
    onComplete,
    timerType = "STOPWATCH" 
}) => {
    const displayStatus = status === 'not running' ? 'ready' : status;

    const progressPercent = maxDuration ? 
        (timerType === "COUNTDOWN" ? 
            Math.floor(((maxDuration - duration) / maxDuration) * 100) : 
            Math.floor((duration / maxDuration) * 100)
        ) : 0;

    return (
        <TimeDisplayContainer status={displayStatus}>
            <TimerHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TimerType>{timerType}</TimerType>
                    <StatusIndicator status={displayStatus}>
                        {displayStatus === 'ready' ? 'DELETE' : displayStatus.toUpperCase()}
                    </StatusIndicator>
                </div>
            </TimerHeader>
            <StyledTimeDisplay>{formatTime(maxDuration ? Math.min(duration, maxDuration) : duration)}</StyledTimeDisplay>
            {maxDuration && status !== 'completed' && (
                <TimeRemaining>
                    {status === 'not running' ? 
                        <>Total time: {formatTime(maxDuration)}</> : 
                        <>Time remaining: {formatTime(Math.max(0, maxDuration - duration))}</>
                    }
                </TimeRemaining>
            )}
            <ButtonContainer>
                {(status === 'paused' || (duration <= 0 && status !== 'completed')) && (
                    <CompleteButton onClick={onComplete} aria-label="Complete timer">
                        Complete
                    </CompleteButton>
                )}
                {(status === 'paused' || duration <= 0) && (
                    <DeleteButton onClick={onDelete} aria-label="Delete timer">
                        Delete
                    </DeleteButton>
                )}
            </ButtonContainer>
            <div style={{ width: '100%', padding: '0 20px' }}>
                {maxDuration && status !== 'completed' && (
                    <ProgressBar 
                        percent={progressPercent} 
                        showLabel={false}
                    />
                )}
            </div>
        </TimeDisplayContainer>
    );
};

export default TimerDisplay;
