import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';
import '../styles/About.css';
import '../styles/Skills.css';
import '../styles/Contact.css';

export default function AboutSection() {
    const timelineRef = useRef(null);

    useEffect(() => {
        // --- High-End Scroll-Focus Interaction ---
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', // Center-focused area
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('focused-entry');
                } else {
                    entry.target.classList.remove('focused-entry');
                }
            });
        }, observerOptions);

        const entries = document.querySelectorAll('.timeline-entry');
        entries.forEach(el => observer.observe(el));

        // --- Original Timeline Line Logic ---
        let currentTimelineProgress = 0;
        let targetTimelineProgress = 0;
        let frameId;

        const smoothTimelineScroll = () => {
            const timelineSystem = document.querySelector('.vertical-timeline-system');
            if (timelineSystem) {
                const rect = timelineSystem.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const progress = (window.innerHeight / 2 - rect.top) / rect.height;
                    targetTimelineProgress = Math.min(1, Math.max(0, progress));
                }
            }

            const activeFill = document.querySelector('.timeline-active-fill');
            const scrollingDot = document.querySelector('.timeline-scrolling-dot');
            const timelineMainLine = document.querySelector('.timeline-main-line');

            if (activeFill && scrollingDot && timelineMainLine) {
                currentTimelineProgress += (targetTimelineProgress - currentTimelineProgress) * 0.05;
                const fillHeight = Math.round(currentTimelineProgress * timelineMainLine.offsetHeight * 10) / 10;
                activeFill.style.height = `${fillHeight}px`;
                scrollingDot.style.top = `${fillHeight}px`;
            }
            frameId = requestAnimationFrame(smoothTimelineScroll);
        };

        smoothTimelineScroll();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
        };
    }, []);

    const timelineData = [
        { year: "2018", title: "Iniciación Técnica", desc: "Comienzo del camino autodidacta en programación (HTML/CSS/JS) y redes. Capacitación formal en reparación de PC y dominio de sistemas operativos. La entrada definitiva al ecosistema IT.", meta: "ROOT_ACCESS // SELF_INIT" },
        { year: "2019", title: "Hardware Genesis", desc: "Ensamblaje y configuración integral de mi primer PC de alto rendimiento. Inicio de la experimentación técnica con hardware y sistemas operativos.", meta: "INIT_SYSTEM // BOOT_SEQ_00" },
        { year: "2020", title: "Soporte Técnico - Mr Wonderfull", desc: "Inicio profesional en el área IT. Gestión de soporte técnico presencial y transición a asistencia remota crítica durante la pandemia. Resolución de incidencias en CRM, mantenimiento de software y optimización de hardware para garantizar la continuidad operativa de diversos sectores.", meta: "CORP_SUPPORT // REMOTE_OPS" },
        { year: "2021", title: "Implementación Estratégica & CRM", desc: "Trabajo conjunto con equipo de desarrollo externo para la implementación y 'tunning' de un CRM personalizado. Mi rol fue traducir necesidades operativas en ajustes técnicos y validar cada entrega para asegurar la adopción exitosa del sistema.", meta: "CRM_DEPLOY // DEV_SYNC" },
        { year: "2022", title: "Gestión de Incidencias L1/L2 & L3 Link", desc: "Estructuración del soporte técnico: Cobertura L1 para incidencias generales y L2 para gestión avanzada interna del CRM. Rol crítico como enlace técnico con Nivel 3 (Externo) para reportar y dar seguimiento a fallos graves de servidor y conectividad.", meta: "INCIDENT_MGR // VENDOR_LINK" },
        { year: "2023", title: "Automatización & Optimización de Datos", desc: "Ingeniería de scripts (Python/Batch) para la automatización de procesos administrativos y obtención de turnos, logrando una reducción del 40% en carga operativa. Diseño de bases de datos híbridas (Excel/SQL) y digitalización de flujos burocráticos, mejorando la eficiencia de consulta y gestión en un 30%.", meta: "AUTO_EXEC // SQL_DB_OPS" },
        { year: "2024", title: "Infraestructura Crítica & Diseño Digital", desc: "Gestión integral del ciclo de vida de hardware y redes, ejecutando diagnósticos avanzados (BIOS/Drivers) para asegurar 'Zero Downtime' en estaciones de trabajo críticas. Desarrollo paralelo de identidad visual corporativa mediante activos digitales de alto impacto (Photoshop), alineando la estrategia técnica con la visión de marketing.", meta: "HARDWARE_OPS // DIGITAL_DESIGN" },
        { year: "2025", title: "Ingeniería (UTN) & Soporte Remoto Integral", desc: "Ingreso a Ingeniería en Sistemas (UTN) para formalizar mi trayectoria. En paralelo, operé en modalidad 100% remota como Help Desk L1/L2, brindando asistencia personalizada a las áreas de oficina y gestionando el escalado técnico con Nivel 3. Mi rol abarcó la resolución de errores operativos, generación de documentación técnica y creación de contenido digital.", meta: "REMOTE_HD // DOCS_MANAGER" },
        { year: "2026", title: "Ingeniería de Software & Arquitectura Escalable", desc: "Proyección hacia el diseño y desarrollo de arquitecturas de software de alto rendimiento. Enfoque en la construcción de soluciones robustas y escalables, aplicando patrones de ingeniería avanzada para resolver desafíos tecnológicos complejos en el ecosistema Full Stack.", meta: "FUTURE_TECH // SCALABLE_ARCH" },
    ];

    return (
        <section id="about" className="section">
            <ScrollReveal className="about-cascade-container professional-redesign" once={true}>
                <h2 className="section-title">SYSTEM_PROFILE</h2>

                <div className="about-intro dashboard-layout">
                    <div className="profile-column">
                        <div className="holo-node bento-card" data-node="bio">
                            <div className="tech-header">
                                <span className="id-code">ID: LS-G-2026 // IT.SPECIALIST</span>
                                <div className="status-badge"><span className="blink-dot"></span>ONLINE</div>
                            </div>

                            <div className="profile-grid">
                                <div className="main-info">
                                    <h3 className="role-title">FULL STACK DEV<br />& IT SPECIALIST</h3>
                                    <p className="bio-text">
                                        Desarrollador Junior Full Stack con sólida base en Soporte IT.
                                        Transformo problemas complejos en soluciones digitales eficientes, combinando <strong>ingeniería de software moderna</strong> con un profundo entendimiento de <strong>infraestructura y hardware</strong>.
                                    </p>
                                </div>

                                <div className="specs-column">
                                    <div className="spec-item">
                                        <span className="label">YEARS_EXP</span>
                                        <span className="value">05+</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="label">BASE_LOC</span>
                                        <span className="value">LA PLATA, AR</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="label">FOCUS</span>
                                        <span className="value">PERFORMANCE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer-deco">
                                <div className="barcode">||| || ||| ||</div>
                                <div className="verified-stamp">SYS_VERIFIED</div>
                            </div>
                        </div>
                    </div>

                    <div className="terminal-column">
                        <div className="window-console dashboard-module">
                            <div className="console-header">
                                <div className="console-title">C:\WINDOWS\system32\cmd.exe</div>
                                <div className="console-controls">
                                    <span>_</span>
                                    <span>□</span>
                                    <span className="close-btn">×</span>
                                </div>
                            </div>
                            <div className="console-body">
                                <div className="console-line"><span className="prompt">{'>'}</span> <span className="label">SYSTEM_USER:</span> <span className="value">Leandro Graneros</span></div>
                                <div className="console-line"><span className="prompt">{'>'}</span> <span className="label">CLASS:</span>
                                    <span className="value">Junior FullStack Developer (React/Python) + IT Technician</span>
                                </div>
                                <div className="console-line"><span className="prompt">{'>'}</span> <span className="label">STATUS:</span>
                                    <span className="value">Online / Ingeniería en Sistemas (UTN)</span>
                                </div>
                                <br />
                                <div className="console-line"><span className="prompt">{'>'}</span> <span className="label">PROFILE_SUMMARY:</span></div>
                                <div className="console-text">
                                    Perfil híbrido con +5 años de trayectoria.<br />
                                    Combino la lógica de la ingeniería con la<br />
                                    resolución práctica del soporte técnico.<br />
                                    <br />
                                    Mi enfoque es simple: Crear sistemas que<br />
                                    funcionen, optimizar procesos que tardan<br />
                                    y solucionar problemas que frenan.
                                </div>
                                <br />
                                <div className="console-line blink-line"><span className="prompt">{'>'}</span> <span className="value">SCROLL_DOWN_FOR_LOGS...</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vertical-timeline-system">
                    <div className="timeline-main-line">
                        <div className="timeline-active-fill"></div>
                        <div className="timeline-scrolling-dot"></div>
                    </div>

                    <div className="timeline-entries" ref={timelineRef}>
                        {timelineData.map((item, index) => (
                            <div key={item.year} className={`timeline-entry ${index % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="entry-tech-label">{item.meta}</div>
                                <span className="year">{item.year}</span>
                                <div className="entry-card">
                                    <div className="card-inner-deco"></div>
                                    <div className="card-top-info">
                                        <span className="entry-id">#{String(index + 1).padStart(3, '0')}</span>
                                        <span className="entry-auth">AUTH_SECURED</span>
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                    <div className="card-bottom-line"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="about-footer">
                    {/* CV DOWNLOAD SECTION - HOLOGRAPHIC STYLE */}
                    <div className="skills-dashboard" style={{ marginTop: 0, display: 'block', maxWidth: '800px', margin: '0 auto' }}>
                        <div className="skill-module wide" style={{ width: '100%' }}>

                            {/* HOLOGRAM ICONS */}
                            <div className="hologram-projection">
                                <i className="fa-solid fa-file-pdf projection-icon" style={{ fontSize: '40px', color: '#00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></i>
                                <i className="fa-solid fa-download projection-icon" style={{ fontSize: '40px', color: '#00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '0.5s' }}></i>
                            </div>

                            <div className="module-inner">
                                <div className="module-content" style={{ alignItems: 'center', textAlign: 'center' }}>

                                    {/* META HEADERS */}
                                    <div className="module-meta" style={{ width: '100%' }}>
                                        <span className="module-id">DOC_2026.SYS</span>
                                        <span className="module-status">[SECURE_LINK]</span>
                                    </div>

                                    {/* MAIN CONTENT */}
                                    <h3>DIGITAL_DOSSIER</h3>
                                    <p style={{ maxWidth: '600px', margin: '0 0 2rem 0' }}>
                                        Acceso directo al registro completo de competencias, trayectoria técnica y certificaciones.
                                        <br />
                                        <span style={{ fontSize: '0.8rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>SHA-256 VERIFIED • PDF FORMAT • 2.4 MB</span>
                                    </p>

                                    {/* PROGRESS LINE DECORATION */}
                                    <div className="progress-container" style={{ maxWidth: '400px', margin: '0 0 2rem 0' }}>
                                        <div className="progress-bar-segment" style={{ width: '100%', background: 'linear-gradient(90deg, #00f0ff, transparent)' }}></div>
                                    </div>

                                    {/* DOWNLOAD BUTTON */}
                                    <a href={`${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/cv.pdf`} download className="launch-btn" style={{ maxWidth: '300px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid #00f0ff', color: '#00f0ff' }}>
                                        <div className="launch-content">
                                            <i className="fa-solid fa-file-arrow-down"></i>
                                            <span>INITIALIZE_DOWNLOAD</span>
                                        </div>
                                        <div className="launch-glitch"></div>
                                    </a>

                                    <div style={{ marginTop: '1rem', fontSize: '0.7rem', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>
                                        AVAILABLE_FOR_HIRE // 2026
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="holo-grid-mask"></div>
            </ScrollReveal>
        </section>
    );
}
