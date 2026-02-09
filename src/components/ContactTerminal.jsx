import ScrollReveal from './ScrollReveal';
import Contact3D from './Contact3D';
import { socials } from '../data/socialsData';
import '../styles/Contact.css';

export default function ContactTerminal() {
    return (
        <section id="contact" className="section contact-section dark-bg">
            <Contact3D />

            <ScrollReveal className="container contact-container">
                {/* NEW UNIFIED LAYOUT: NEXUS COMMAND HUB */}
                <div className="terminal-interface">

                    {/* 1. DASHBOARD HEADER */}
                    <div className="terminal-header" style={{ justifyContent: 'center' }}>
                        <h2 className="glitch-title" data-text="CONTACTO">CONTACTO</h2>
                    </div>

                    {/* 2. DASHBOARD BODY (Grid Interno) */}
                    <div className="terminal-body">

                        {/* LEFT COLUMN: IDENTIFICATION & SOCIALS */}
                        <div className="module-socials">
                            <h3 className="module-title">REDES SOCIALES</h3>
                            <div className="actions-grid">
                                <a href={socials.linkedin.url} target="_blank" rel="noopener noreferrer" className="cyber-btn">
                                    <i className={socials.linkedin.icon}></i>
                                    <span className="btn-text">{socials.linkedin.label}</span>
                                    <span className="btn-decor"></span>
                                </a>
                                <a href={socials.github.url} target="_blank" rel="noopener noreferrer" className="cyber-btn">
                                    <i className={socials.github.icon}></i>
                                    <span className="btn-text">{socials.github.label}</span>
                                    <span className="btn-decor"></span>
                                </a>
                            </div>
                            <p className="terminal-desc">
                                "La colaboración es la clave de la evolución. Iniciemos una conexión segura."
                            </p>
                        </div>

                        {/* RIGHT COLUMN: ACTION PROTOCOL */}
                        <div className="module-action">
                            <h3 className="module-title">ENVIAR MENSAJE</h3>
                            <a href={`mailto:${socials.email}`} className="launch-btn">
                                <div className="launch-content">
                                    <i className="fa-solid fa-paper-plane"></i>
                                    <span>ENVIAR MENSAJE</span>
                                </div>
                                <div className="launch-glitch"></div>
                            </a>
                        </div>

                    </div>

                    {/* 3. DASHBOARD FOOTER (LOGS) */}


                </div>
            </ScrollReveal>

            <div className="section-footer">
                <div className="footer-line"></div>
                <div className="footer-meta">
                    <span>LA_PLATA // ARGENTINA</span>

                </div>
            </div>
        </section>
    );
}
