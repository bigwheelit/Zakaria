/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#059669', // Main primary color
                    600: '#047857',
                    700: '#065f46',
                    800: '#064e3b',
                    900: '#022c22',
                },
                secondary: {
                    50: '#fef3c7',
                    100: '#fde68a',
                    200: '#fcd34d',
                    300: '#fbbf24',
                    400: '#f59e0b',
                    500: '#D97706', // Main secondary color
                    600: '#b45309',
                    700: '#92400e',
                    800: '#78350f',
                    900: '#451a03',
                },
                accent: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#1E40AF', // Main accent color
                    600: '#1e40af',
                    700: '#1e3a8a',
                    800: '#1e3a8a',
                    900: '#172554',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                body: ['Open Sans', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
