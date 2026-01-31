import { useRef, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import '../styles/Projects.css';

export default function ProjectsVault() {
    const vaultRef = useRef(null);
    const dragData = useRef({ isDown: false, startX: 0, scrollLeft: 0, hasMoved: false });

    useEffect(() => {
        const slider = vaultRef.current;
        if (!slider) return;

        // --- CYLINDRICAL 3D LOGIC ---
        const update3DEffect = () => {
            const cards = slider.querySelectorAll('.vault-item');
            const centerX = window.innerWidth / 2;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const distanceFromCenter = cardCenter - centerX;

                const rotation = (distanceFromCenter / window.innerWidth) * 70;
                const depth = Math.abs(distanceFromCenter / window.innerWidth) * -250;

                card.style.transform = `rotateY(${rotation}deg) translateZ(${depth}px)`;
                const opacity = 1 - Math.min(0.5, Math.abs(distanceFromCenter / window.innerWidth));
                card.style.opacity = opacity;
            });
        };

        // --- REFINED GRAB TO SCROLL LOGIC ---
        const onMouseDown = (e) => {
            dragData.current.isDown = true;
            dragData.current.hasMoved = false;
            slider.classList.add('active');
            dragData.current.startX = e.pageX - slider.offsetLeft;
            dragData.current.scrollLeft = slider.scrollLeft;
        };

        const onMouseLeave = () => {
            dragData.current.isDown = false;
            slider.classList.remove('active');
        };

        const onMouseUp = () => {
            dragData.current.isDown = false;
            slider.classList.remove('active');
            setTimeout(() => { dragData.current.hasMoved = false; }, 50);
        };

        const onMouseMove = (e) => {
            if (!dragData.current.isDown) return;

            const x = e.pageX - slider.offsetLeft;
            const distance = Math.abs(x - dragData.current.startX);

            if (distance > 5) {
                dragData.current.hasMoved = true;
                e.preventDefault();
                const walk = (x - dragData.current.startX) * 2;
                slider.scrollLeft = dragData.current.scrollLeft - walk;
            }
        };

        // Handle click on links to prevent redirection if we were dragging
        const handleLinkClick = (e) => {
            if (dragData.current.hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        // PREVENT DEFAULT BROWSER DRAG (Link dragging)
        const preventDefaultDrag = (e) => {
            e.preventDefault();
        };

        slider.addEventListener('scroll', update3DEffect);
        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('mouseleave', onMouseLeave);
        slider.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('mousemove', onMouseMove);
        slider.addEventListener('dragstart', preventDefaultDrag); // CRITICAL: Stop browser's link dragging

        slider.addEventListener('click', handleLinkClick, true);

        update3DEffect();
        window.addEventListener('resize', update3DEffect);

        return () => {
            slider.removeEventListener('scroll', update3DEffect);
            slider.removeEventListener('mousedown', onMouseDown);
            slider.removeEventListener('mouseleave', onMouseLeave);
            slider.removeEventListener('mouseup', onMouseUp);
            slider.removeEventListener('mousemove', onMouseMove);
            slider.removeEventListener('dragstart', preventDefaultDrag);
            slider.removeEventListener('click', handleLinkClick, true);
            window.removeEventListener('resize', update3DEffect);
        };
    }, []);

    return (
        <section id="projects" className="section">
            <ScrollReveal threshold={0.01}>
                <div className="container">
                    <h2 className="section-title">Secure_Archives</h2>
                </div>

                <div className="projects-vault" ref={vaultRef}>
                    {/* PROYECTO 1: Fortnite Monitor */}
                    <a href="./FortniteLatencyMonitor/index.html" className="vault-item" draggable="false">
                        <div className="card-strip">
                            <span>UID: PING-MON-001</span>
                        </div>
                        <div className="card-body">
                            <h3>MONITOR_DE_LATENCIA.exe</h3>
                            <p>Herramienta de diagnóstico de red para monitorear latencia y pérdida de paquetes en tiempo real.</p>

                            <div className="item-meta">
                                <span>TYPE: DIAGNOSTIC</span>
                                <span>STATUS: STABLE</span>
                            </div>

                            <div className="tech-stack">
                                <i className="devicon-python-plain" title="Python"></i>
                                <i className="devicon-tkinter-plain" title="Tkinter"></i>
                                <i className="devicon-amazonwebservices-plain-wordmark" title="AWS"></i>
                            </div>
                        </div>
                    </a>

                    {/* PROYECTO 2: Key Visualizer */}
                    <a href="./KeyResponseVisualizer/index.html" className="vault-item" draggable="false">
                        <div className="card-strip">
                            <span>UID: INPUT-VIS-002</span>
                        </div>
                        <div className="card-body">
                            <h3>KEY_RESPONSE_VISUALIZER.js</h3>
                            <p>Visualizador interactivo de eventos de teclado DOM para análisis de input lag y ghosting.</p>

                            <div className="item-meta">
                                <span>TYPE: UTILITY</span>
                                <span>STATUS: ACTIVE</span>
                            </div>

                            <div className="tech-stack">
                                <i className="devicon-javascript-plain" title="JavaScript"></i>
                                <i className="devicon-html5-plain" title="HTML5"></i>
                                <i className="devicon-css3-plain" title="CSS3"></i>
                            </div>
                        </div>
                    </a>

                    {/* PROYECTO 3: Nexus Hardware */}
                    <a href="./NexusHardware/frontend/dist/index.html" className="vault-item" draggable="false">
                        <div className="card-strip">
                            <span>UID: NEXUS-STORE-003</span>
                        </div>
                        <div className="card-body">
                            <h3>NEXUS_HARDWARE_STORE.app</h3>
                            <p>E-commerce completo con carrito, dashboard de ventas y gestión de stock en tiempo real.</p>

                            <div className="item-meta">
                                <span>TYPE: E-COMMERCE</span>
                                <span>STATUS: DEPLOYED</span>
                            </div>

                            <div className="tech-stack">
                                <i className="devicon-react-original" title="React"></i>
                                <i className="devicon-tailwindcss-original" title="Tailwind"></i>
                                <i className="devicon-fastapi-plain" title="FastAPI"></i>
                                <i className="devicon-postgresql-plain" title="PostgreSQL"></i>
                            </div>
                        </div>
                    </a>

                    {/* PROYECTO 4: Data Automation */}
                    <a href="#projects" className="vault-item" onClick={(e) => e.preventDefault()} draggable="false">
                        <div className="card-strip">
                            <span>UID: DATA-AUTO-VBA</span>
                        </div>
                        <div className="card-body">
                            <h3>Data_Automation.exe</h3>
                            <p>Motor de optimización de stock (C + Python). Ahora integrado nativamente en <strong>Nexus Hardware</strong>.</p>

                            <div className="item-meta">
                                <span>TYPE: ALGORITHM</span>
                                <span>STATUS: INTEGRATED</span>
                            </div>

                            <div className="tech-stack">
                                <i className="devicon-python-plain" title="Python"></i>
                                <i className="devicon-c-plain" title="C"></i>
                                <i className="devicon-microsoftsqlserver-plain" title="SQL"></i>
                            </div>
                        </div>
                    </a>

                    {/* PROYECTO 5: NovaManager */}
                    <a href="./NovaManager/frontend/landing.html" className="vault-item" target="_blank" rel="noopener noreferrer" draggable="false">
                        <div className="card-strip">
                            <span>UID: NOVAMANAGER-V1</span>
                        </div>
                        <div className="card-body">
                            <h3>NOVAMANAGER_SYSTEM.app</h3>
                            <p>Sistema integral de gestión para contratistas: Finanzas, Stock y Personal en real-time.</p>

                            <div className="item-meta">
                                <span>TYPE: MANAGEMENT</span>
                                <span>STATUS: ONLINE</span>
                            </div>

                            <div className="tech-stack">
                                <i className="devicon-python-plain" title="Python"></i>
                                <i className="devicon-react-original" title="React"></i>
                                <i className="devicon-sqlite-plain" title="SQLite"></i>
                                <i className="devicon-tailwindcss-original" title="Tailwind"></i>
                            </div>
                        </div>
                    </a>
                </div>
            </ScrollReveal>
        </section>
    );
}
