import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import '../styles/About.css';
import '../styles/Skills.css';
import '../styles/Contact.css';

export default function AboutSection() {
    const timelineRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);

    // Datos de las tabs
    const tabsData = [
        {
            id: 'bio',
            tabLabel: 'Sobre Mí',
            icon: 'fa-user-gear',
            title: 'PERFIL PROFESIONAL',
            content: 'Desarrollador Full Stack con raíces en Soporte IT. Me dedico a crear soluciones digitales eficientes, uniendo la ingeniería de software moderna con un conocimiento sólido de infraestructura y hardware.'
        },
        {
            id: 'exp',
            tabLabel: 'TRAYECTORIA',
            icon: 'fa-chart-line',
            title: 'TRAYECTORIA',
            content: 'Más de 5 años evolucionando en el sector IT. Mi camino va desde el soporte técnico (Help Desk L1/L2) hasta el desarrollo Full Stack, especializándome en automatización, CRMs y arquitecturas escalables.'
        },
        {
            id: 'loc',
            tabLabel: 'Ubicación',
            icon: 'fa-location-dot',
            title: 'UBICACIÓN ACTUAL',
            content: 'La Plata, Buenos Aires, Argentina • Zona horaria GMT-3.'
        },
        {
            id: 'status',
            tabLabel: 'Disponibilidad',
            icon: 'fa-rocket',
            title: 'ESTADO ACTUAL',
            content: '¡Listo para nuevos desafíos! Disponible para proyectos freelance y roles full-time. Mi enfoque abarca el desarrollo de software, aplicaciones web modernas y la implementación de soluciones tecnológicas integrales.'
        }
    ];

    // Timeline logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('focused-entry');
                else entry.target.classList.remove('focused-entry');
            });
        }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

        const timelineElements = document.querySelectorAll('.timeline-entry');
        timelineElements.forEach(el => observer.observe(el));

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
        { year: "2019", title: "Hardware Genesis", desc: "Ensamblaje y configuración integral de mi primer PC de alto rendimiento. Inicio de la experimentación técnica con hardware and sistemas operativos.", meta: "INIT_SYSTEM // BOOT_SEQ_00" },
        { year: "2020", title: "Soporte Técnico - Mr Wonderfull", desc: "Inicio profesional en el área IT. Gestión de soporte técnico presencial y transición a asistencia remota crítica durante la pandemia. Resolución de incidencias en CRM, mantenimiento de software and optimización de hardware para garantizar la continuidad operativa de diversos sectores.", meta: "CORP_SUPPORT // REMOTE_OPS" },
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
                <h2 className="section-title">PERFIL PROFESIONAL</h2>

                <div className="console-container">
                    {/* Tabs Header */}
                    <div className="console-tabs-header">
                        {tabsData.map((tab, index) => (
                            <div
                                key={tab.id}
                                className={`console-tab ${index === activeTab ? 'active' : ''}`}
                                onClick={() => setActiveTab(index)}
                            >
                                <i className={`fas ${tab.icon} tab-icon`}></i>
                                <span className="tab-label">{tab.tabLabel}</span>
                                <div className="tab-indicator"></div>
                            </div>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="console-content-panel">
                        <div className="scanline"></div>
                        <div className="console-header-bar">
                            <span className="console-prompt">&gt;_</span>
                            <span className="console-path">~/profile/{tabsData[activeTab].id}</span>
                            <span className="console-status">[ACTIVE]</span>
                        </div>

                        {tabsData.map((tab, index) => (
                            <div
                                key={tab.id}
                                className={`console-content ${index === activeTab ? 'active' : ''}`}
                            >
                                <div className="content-icon">
                                    <i className={`fas ${tab.icon}`}></i>
                                </div>
                                <h3 className="content-title">{tab.title}</h3>
                                <p className="content-text">{tab.content}</p>
                                <div className="content-footer"></div>

                            </div>
                        ))}
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

                {/* CV Section */}
                <div className="about-footer">
                    <div className="skills-dashboard" style={{ marginTop: 0, display: 'block', maxWidth: '800px', margin: '0 auto' }}>
                        <div className="skill-module wide" style={{ width: '100%' }}>
                            <div className="hologram-projection">
                                <i className="fa-solid fa-file-pdf projection-icon" style={{ fontSize: '40px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></i>
                                <i className="fa-solid fa-download projection-icon" style={{ fontSize: '40px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '0.5s' }}></i>
                            </div>
                            <div className="module-inner">
                                <div className="module-content" style={{ alignItems: 'center', textAlign: 'center' }}>
                                    <div className="module-meta" style={{ width: '100%' }}>
                                        <span className="module-id">CV_2026.PDF</span>
                                        <span className="module-status">[ENLACE_SEGURO]</span>
                                    </div>
                                    <h3>CV DIGITAL</h3>
                                    <p style={{ maxWidth: '600px', margin: '0 0 2rem 0' }}>
                                        Acceso directo al registro completo de competencias, trayectoria técnica y certificaciones.
                                    </p>
                                    <a href={`${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/cv.pdf`} download className="launch-btn" style={{ maxWidth: '400px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                                        <i className="fa-solid fa-file-arrow-down"></i>
                                        <span style={{ marginLeft: '10px' }}>DESCARGAR CV</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}
