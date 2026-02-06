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
                    <div className="terminal-header">
                        <div className="status-badge">
                            <span className="pulse-dot"></span>
                            <span>SYSTEM_STATUS: ONLINE</span>
                        </div>
                        <h2 className="glitch-title" data-text="CONTACT_HUB">CONTACT_HUB</h2>
                        <div className="terminal-controls">
                            <span className="control-dot"></span>
                            <span className="control-dot"></span>
                            <span className="control-dot"></span>
                        </div>
                    </div>

                    {/* 2. DASHBOARD BODY (Grid Interno) */}
                    <div className="terminal-body">

                        {/* LEFT COLUMN: IDENTIFICATION & SOCIALS */}
                        <div className="module-socials">
                            <h3 className="module-title">NET_UPLINKS</h3>
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
                            <h3 className="module-title">TRANSMISSION_PROTOCOL</h3>
                            <div className="protocol-display">
                                <span className="protocol-id">{socials.transmissionProtocol.reqId}</span>
                                <span className="protocol-status">{socials.transmissionProtocol.status}</span>
                            </div>

                            <a href={`mailto:${socials.email}`} className="launch-btn">
                                <div className="launch-content">
                                    <i className="fa-solid fa-paper-plane"></i>
                                    <span>{socials.transmissionProtocol.buttonText}</span>
                                </div>
                                <div className="launch-glitch"></div>
                            </a>
                        </div>

                    </div>

                    {/* 3. DASHBOARD FOOTER (LOGS) */}
                    <div className="terminal-footer">
                        <div className="system-logs-inline">
                            <span className="log-entry">&gt; LISTENING_ON_PORT_80...</span>
                            <span className="log-entry">&gt; ENCRYPTION: AES-256</span>
                            <span className="log-entry success">&gt; UPLINK_ESTABLISHED</span>
                        </div>
                        <div className="footer-deco">
                            <span className="deco-line"></span>
                            <span className="deco-id">V.2.0.26</span>
                        </div>
                    </div>

                </div>
            </ScrollReveal>

            <div className="section-footer">
                <div className="footer-line"></div>
                <div className="footer-meta">
                    <span>LA_PLATA // ARGENTINA</span>
                    <span>© 2026 NEXUS_INTERFACE</span>
                </div>
            </div>
        </section>
    );
}
