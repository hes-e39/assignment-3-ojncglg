interface TimerConfig {
    id: string;
    duration: number;
    description: string;
}

function updateUrlWithTimerConfig(timerConfig: TimerConfig[]) {
    const url = new URL(window.location.href);
    url.searchParams.set('timerConfig', JSON.stringify(timerConfig));
    window.history.pushState({}, '', url);
}

function getTimerConfigFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const timerConfig = urlParams.get('timerConfig');
    return timerConfig ? JSON.parse(timerConfig) : null;
}

export { updateUrlWithTimerConfig, getTimerConfigFromUrl };
