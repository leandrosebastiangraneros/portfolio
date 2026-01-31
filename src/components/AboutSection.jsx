import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';
import '../styles/About.css';

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
        { year: "2020", title: "Técnico en Computadoras", desc: "Ingreso al mundo IT como técnico de computadoras, brindando soporte y soluciones de hardware.", meta: "LOG_ENTRY.01 // CORE_BASE" },
        { year: "2021", title: "Experiencia Sistemas I", desc: "Consolidación de habilidades en soporte técnico y gestión de redes.", meta: "SYS_UPDATE // NETWORK_INFRA" },
        { year: "2022", title: "Optimización Operativa", desc: "Desarrollo de flujos de trabajo eficientes para la gestión de activos IT.", meta: "DATA_STRUC // WORKFLOW_OPT" },
        { year: "2023", title: "Automation & Scripts", desc: "Especialización en automatización mediante SQL y macros VBA.", meta: "AUTO_EXEC // SQL_MACRO_DEV" },
        { year: "2024", title: "Desarrollo Web Full Stack", desc: "Creación de aplicaciones web dinámicas y modernas.", meta: "WEB_ENG // REACT_DEPLOY" },
        { year: "2025", title: "Ingeniería en Sistemas (UTN)", desc: "Ingreso a la carrera universitaria para formalizar mi formación profesional en sistemas.", meta: "ACAD_SYNC // UTN_LOG_001" },
        { year: "2026", title: "Digital Showcase", desc: "Desarrollo de proyectos profesionales para mostrar mis habilidades mientras sigo cursando ingeniería.", meta: "SYS_FINAL // PROD_BUILD_MARK" },
    ];

    return (
        <section id="about" className="section">
            <ScrollReveal className="about-cascade-container professional-redesign">
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
                                    <h3 className="role-title">IT SPECIALIST<br />& DEV</h3>
                                    <p className="bio-text">
                                        Specialized in building scalable digital ecosystems.
                                        Bridging the gap between <strong>Fluid UX</strong> and <strong>Robust
                                            Engineering</strong>.
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
                                    <span className="value">IT Specialist & Web Developer</span>
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
                    <div className="dossier-card bento-card">
                        <div className="dossier-header">
                            <div className="security-marker">SECURITY_LEVEL: ALPHA</div>
                            <div className="dossier-id">REF: LG-DOC-2026.SYS</div>
                        </div>

                        <div className="dossier-main">
                            <div className="dossier-info">
                                <h3>DIGITAL_DOSSIER</h3>
                                <p>Accede al registro completo de competencias, trayectoria técnica y certificaciones. Optimizado para procesos de selección de alto impacto.</p>

                                <div className="file-metadata">
                                    <div className="meta-item"><span>TYPE:</span> PDF_ARCHIVE</div>
                                    <div className="meta-item"><span>SIZE:</span> 2.4 MB</div>
                                    <div className="meta-item"><span>BUILD:</span> v2026.01.R</div>
                                </div>
                            </div>

                            <div className="dossier-action">
                                <a href={`${import.meta.env.BASE_URL || "/"}cv.pdf`} download className="holo-download-btn">
                                    <div className="btn-glitch-layer"></div>
                                    <span className="btn-text">INITIALIZE_DOWNLOAD</span>
                                    <div className="btn-scanline"></div>
                                </a>
                                <div className="hire-cta">AVAILABLE_FOR_HIRE // 2026</div>
                            </div>
                        </div>

                        <div className="dossier-footer">
                            <div className="sys-status">
                                <span className="status-label">ENCRYPTION:</span>
                                <span className="status-value">AES-256_STABLE</span>
                            </div>
                            <div className="barcode">||| || | ||| | ||</div>
                        </div>
                    </div>
                </div>

                <div className="holo-grid-mask"></div>
            </ScrollReveal>
        </section>
    );
}
