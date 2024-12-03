import type { Timer } from '../TimerContext';

// Convert timer configurations to a URL-friendly string
export function encodeTimersToURL(timers: Timer[]): string {
    try {
        // Convert timers to a simpler format for URL encoding
        const timerConfigs = timers.map(timer => {
            switch (timer.type) {
                case 'stopwatch':
                    return `sw`;

                case 'countdown':
                    return `cd-${timer.initialDuration / 1000}`;

                case 'XY':
                    return `xy-${timer.rounds}-${timer.workTime / 1000}-${timer.restTime / 1000}`;

                case 'tabata':
                    return `tb-${timer.rounds}-${timer.workTime / 1000}-${timer.restTime / 1000}`;
            }
        });

        // Join all timer configs with a comma
        return timerConfigs.join(',');
    } catch (error) {
        console.error('Error encoding timers:', error);
        return '';
    }
}

// Convert URL string back to timer configurations
export function decodeURLToTimers(urlParam: string): Timer[] {
    try {
        if (!urlParam) return [];

        // Split the URL parameter into individual timer configs
        return urlParam.split(',').map(timerStr => {
            const [type, ...params] = timerStr.split('-');

            switch (type) {
                case 'sw': {
                    return {
                        id: crypto.randomUUID(),
                        type: 'stopwatch',
                        duration: 0,
                        status: 'not running',
                    } as Timer;
                }

                case 'cd': {
                    const duration = Number(params[0]) * 1000;
                    return {
                        id: crypto.randomUUID(),
                        type: 'countdown',
                        duration,
                        initialDuration: duration,
                        status: 'not running',
                    } as Timer;
                }

                case 'xy': {
                    const [xyRounds, xyWork, xyRest] = params.map(Number);
                    return {
                        id: crypto.randomUUID(),
                        type: 'XY',
                        rounds: xyRounds,
                        currentRound: 1,
                        workTime: xyWork * 1000,
                        restTime: xyRest * 1000,
                        isWorking: true,
                        duration: xyWork * 1000,
                        status: 'not running',
                    } as Timer;
                }

                case 'tb': {
                    const [tbRounds, tbWork, tbRest] = params.map(Number);
                    return {
                        id: crypto.randomUUID(),
                        type: 'tabata',
                        rounds: tbRounds,
                        currentRound: 1,
                        workTime: tbWork * 1000,
                        restTime: tbRest * 1000,
                        isWorking: true,
                        duration: tbWork * 1000,
                        status: 'not running',
                    } as Timer;
                }

                default:
                    throw new Error(`Unknown timer type: ${type}`);
            }
        });
    } catch (error) {
        console.error('Error decoding timers:', error);
        return [];
    }
}
