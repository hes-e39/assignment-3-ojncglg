export const saveTimersToLocalStorage = (timers) => {
    localStorage.setItem('timers', JSON.stringify(timers));
};

export const loadTimersFromLocalStorage = () => {
    const timers = localStorage.getItem('timers');
    return timers ? JSON.parse(timers) : [];
};
