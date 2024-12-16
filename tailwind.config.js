/** @type {import('tailwindcss').Config} */
// This is the Tailwind CSS configuration file.
// It defines the content sources, theme customization, and plugins for the Tailwind CSS framework.

export default {
  // Specify the paths to all of the template files in your project
  content: [
    "./index.html", // Include the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JavaScript and TypeScript files in the src directory
  ],
  theme: {
    // Extend the default theme here if needed
    extend: {},
  },
  plugins: [],
}
