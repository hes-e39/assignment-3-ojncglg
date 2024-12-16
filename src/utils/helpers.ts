// This file contains utility functions that are commonly used throughout the application.
// These functions are not specific to React and can be used in any JavaScript context.
// 
// Example functions include:
// - A function to convert seconds to minutes.
// - A function to format time strings.
// 
// Add new helper functions below as needed, ensuring to document each function clearly.

export const secondsToMinutes = (seconds: number): number => {
    // Converts seconds to minutes.
    // @param seconds - The number of seconds to convert.
    // @returns The equivalent number of minutes.
    return Math.floor(seconds / 60);
};

// Add more helper functions as needed.
