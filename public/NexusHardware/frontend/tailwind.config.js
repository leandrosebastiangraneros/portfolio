/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // "Void & Light" Coherent Palette
                'void': '#000000',      // Absolute Zero
                'surface': '#030303',   // Deepest Grey
                'surface-highlight': '#0a0a0a', // Lighter Surface
                'glass': 'rgba(255, 255, 255, 0.03)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',


                // Accents - Minimalist Neon
                'accent': '#00f0ff',        // Electric Cyan (Primary Action)
                'accent-dim': 'rgba(0, 240, 255, 0.1)',
                'accent-glow': 'rgba(0, 240, 255, 0.5)',

                'secondary': '#a020f0',     // Deep Violet (Depth/Gradient)

                // Text
                'txt-primary': '#ffffff',
                'txt-secondary': '#9ca3af', // Cool Grey
                'txt-dim': '#4b5563',       // Dark Grey

                // Functional
                'success': '#00ff9d',
                'error': '#ff003c',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
                'mono': ['Space Mono', 'monospace'],
                'display': ['Orbitron', 'sans-serif'], // For Headlines only
            },
            backgroundImage: {
                'void-gradient': 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)',
                'accent-gradient': 'linear-gradient(135deg, #00f0ff 0%, #00c3cf 100%)',
            }
        },
    },
    plugins: [],
}
