export const projects = [
    {
        id: "PING-MON-001",
        status: "[STABLE]",
        title: "MONITOR_DE_LATENCIA.exe",
        description: "Herramienta de diagnóstico de red para monitorear latencia y pérdida de paquetes en tiempo real.",
        link: "/FortniteLatencyMonitor/index.html",
        icons: {
            main: "fa-brands fa-python",
            mainColor: "#00f0ff",
            secondary: "fa-brands fa-aws",
            secondaryColor: "#00f0ff"
        },
        techStack: [
            { icon: "devicon-python-plain", name: "Python" },
            { icon: "devicon-tkinter-plain", name: "Tkinter" },
            { icon: "devicon-amazonwebservices-plain-wordmark", name: "AWS" }
        ]
    },
    {
        id: "INPUT-VIS-002",
        status: "[ACTIVE]",
        title: "KEY_RESPONSE.js",
        description: "Visualizador interactivo de eventos de teclado DOM para análisis de input lag y ghosting.",
        link: "/KeyResponseVisualizer/index.html",
        icons: {
            main: "fa-brands fa-js",
            mainColor: "#f0db4f",
            secondary: "fa-solid fa-keyboard",
            secondaryColor: "#00f0ff"
        },
        techStack: [
            { icon: "devicon-javascript-plain", name: "JavaScript" },
            { icon: "devicon-html5-plain", name: "HTML5" },
            { icon: "devicon-css3-plain", name: "CSS3" }
        ]
    },
    {
        id: "NEXUS-STORE-003",
        status: "[DEPLOYED]",
        title: "NEXUS_HARDWARE.app",
        description: "E-commerce completo con carrito, dashboard de ventas y gestión de stock en tiempo real.",
        link: "nexus/index.html",
        icons: {
            main: "fa-brands fa-react",
            mainColor: "#00f0ff",
            secondary: "fa-solid fa-cart-shopping",
            secondaryColor: "#00f0ff"
        },
        techStack: [
            { icon: "devicon-react-original", name: "React" },
            { icon: "devicon-tailwindcss-original", name: "Tailwind" },
            { icon: "devicon-fastapi-plain", name: "FastAPI" },
            { icon: "devicon-postgresql-plain", name: "PostgreSQL" }
        ]
    },
    {
        id: "DATA-AUTO-VBA",
        status: "[INTEGRATED]",
        title: "Data_Automation.exe",
        description: "Motor de optimización de stock (C + Python). Ahora integrado nativamente en Nexus Hardware.",
        link: "#projects",
        isPreventDefault: true,
        icons: {
            main: "fa-solid fa-database",
            mainColor: "#00f0ff",
            secondary: "fa-solid fa-gears",
            secondaryColor: "#00f0ff"
        },
        techStack: [
            { icon: "devicon-python-plain", name: "Python" },
            { icon: "devicon-c-plain", name: "C" },
            { icon: "devicon-microsoftsqlserver-plain", name: "SQL" }
        ]
    },
    {
        id: "NOVAMANAGER-V1",
        status: "[ONLINE]",
        title: "NOVAMANAGER.sys",
        description: "Sistema integral de gestión para contratistas: Finanzas, Stock y Personal en real-time.",
        link: "https://portfolio-hazel-five-14.vercel.app/",
        target: "_blank",
        icons: {
            main: "fa-brands fa-react",
            mainColor: "#00f0ff",
            secondary: "fa-solid fa-chart-line",
            secondaryColor: "#00ff9d"
        },
        techStack: [
            { icon: "devicon-python-plain", name: "Python" },
            { icon: "devicon-react-original", name: "React" },
            { icon: "devicon-sqlite-plain", name: "SQLite" },
            { icon: "devicon-tailwindcss-original", name: "Tailwind" }
        ]
    }
];
