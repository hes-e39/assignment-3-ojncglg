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
                    return `xy-${timer.rounds}-${timer.workTime / 1000}-${timer.restTime / 1000}`;

                case 'tabata':
                    return `tb-${timer.rounds}-${timer.workTime / 1000}-${timer.restTime / 1000}`;
            }
        });

        return timerConfigs.join(',');
    } catch {
        return '';
    }
}

// Simple decoder function that returns empty array for now
export function decodeURLToTimers(urlParam: string): Timer[] {
    if (!urlParam) {
        return [];
    }
    return [];
}
