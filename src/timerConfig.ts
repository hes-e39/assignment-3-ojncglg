// This file contains configuration settings and helper functions for timer-related functionalities.
// It includes functions to convert time units and a configuration object for the stopwatch.

// Helper function to convert minutes to milliseconds
const minutesToMs = (minutes: number): number => {
    // Converts minutes to milliseconds.
    // @param minutes - The number of minutes to convert.
    // @returns The equivalent number of milliseconds.
    return minutes * 60 * 1000;
};

// Helper function to convert seconds to milliseconds
const secondsToMs = (seconds: number): number => {
    // Converts seconds to milliseconds.
    // @param seconds - The number of seconds to convert.
    // @returns The equivalent number of milliseconds.
    return seconds * 1000;
};

export const TIMER_CONFIG = {
    // Stopwatch maximum time configuration
    // Default: 2 minutes and 30 seconds
    // To modify: Change the values in minutesToMs() and/or secondsToMs()
    // Examples:
    // - For 3 minutes: minutesToMs(3)
    // - For 1 minute and 45 seconds: minutesToMs(1) + secondsToMs(45)
    // - For 45 seconds: secondsToMs(45)
    STOPWATCH_MAX_TIME: minutesToMs(2) + secondsToMs(30),

    // Add other timer configurations here as needed
};

// Export helper functions in case they're needed elsewhere
export const timeHelpers = {
    minutesToMs,
    secondsToMs,
};
