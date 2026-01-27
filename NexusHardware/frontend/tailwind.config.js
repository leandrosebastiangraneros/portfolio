/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'accent-purple': 'var(--accent-purple)',
                'accent-cyan': 'var(--accent-cyan)',
                'bg-dark': 'var(--bg-color)',
            },
            fontFamily: {
                'main': ['Inter', 'sans-serif'],
                'mono': ['Space Mono', 'monospace'],
                'display': ['Rajdhani', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
