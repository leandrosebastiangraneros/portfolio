/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Modern palette
                'primary': '#0f172a', // Slate 900
                'secondary': '#1e293b', // Slate 800
                'accent': '#3b82f6', // Blue 500
                'accent-hover': '#2563eb', // Blue 600
                'text-main': '#f8fafc', // Slate 50
                'text-muted': '#94a3b8', // Slate 400
                'danger': '#ef4444', // Red 500
                'success': '#10b981', // Emerald 500
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
