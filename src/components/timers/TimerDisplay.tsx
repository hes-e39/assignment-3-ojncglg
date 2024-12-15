import { formatTime } from '../../utils/timeUtils';
import { 
    TimeDisplayContainer, 
    TimeDisplay as StyledTimeDisplay, 
    TimeRemaining, 
    ButtonContainer,
    TimerHeader,
    TimerType,
    DeleteButton,
    StatusIndicator
} from '../SharedStyles';
import type { TimerStatus } from './types';

interface TimerDisplayProps {
    duration: number;
    maxDuration?: number;
    status: TimerStatus;
    onDelete?: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ duration, maxDuration, status, onDelete }) => {
    const displayStatus = status === 'not running' ? 'ready' : status;

    return (
        <TimeDisplayContainer status={displayStatus}>
            <TimerHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TimerType>STOPWATCH</TimerType>
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
                {status !== 'running' && (
                    <DeleteButton onClick={onDelete} aria-label="Delete timer">
                        Delete
                    </DeleteButton>
                )}
            </ButtonContainer>
        </TimeDisplayContainer>
    );
};

export default TimerDisplay;
