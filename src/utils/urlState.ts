import type { Timer } from '../TimerContext';

// Convert timer configurations to a URL-friendly string
export function encodeTimersToURL(timers: Timer[]): string {
    try {
        // Convert timers to a simpler format for URL encoding
        const timerConfigs = timers.map(timer => {
            switch (timer.type) {
                case 'stopwatch':
                    return 'sw';

                case 'countdown':
                    return `cd-${timer.initialDuration / 1000}`;

                case 'XY':
                    return `xy-${timer.rounds}-${timer.workTime / 1000}`;

                case 'tabata':
                    return `tb-${timer.rounds}-${timer.workTime / 1000}-${timer.restTime / 1000}`;
            }
        });

        return timerConfigs.join(',');
    } catch {
        return '';
    }
}

// Convert URL string back to timer configurations
export function decodeURLToTimers(urlParam: string): Timer[] {
    if (!urlParam) {
        return [];
    }

    return urlParam.split(',').map(timerStr => {
        const [type, ...params] = timerStr.split('-');

        switch (type) {
            case 'sw': {
                return {
                    type: 'stopwatch',
                    duration: 0,
                    status: 'not running',
                } as Timer;
            }

            case 'cd': {
                const duration = Number(params[0]) * 1000;
                return {
                    type: 'countdown',
                    duration,
                    initialDuration: duration,
                    status: 'not running',
                } as Timer;
            }

            case 'xy': {
                const [rounds, workTime] = params.map(Number);
                return {
                    type: 'XY',
                    rounds,
                    currentRound: 1,
                    workTime: workTime * 1000,
                    isWorking: true,
                    duration: workTime * 1000,
                    status: 'not running',
                } as Timer;
            }

            case 'tb': {
                const [rounds, workTime, restTime] = params.map(Number);
                return {
                    type: 'tabata',
                    rounds,
                    currentRound: 1,
                    workTime: workTime * 1000,
                    restTime: restTime * 1000,
                    isWorking: true,
                    duration: workTime * 1000,
                    status: 'not running',
                } as Timer;
            }

            default: {
                throw new Error(`Unknown timer type: ${type}`);
            }
        }
    });
}
