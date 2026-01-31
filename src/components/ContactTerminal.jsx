import ScrollReveal from './ScrollReveal';
import Contact3D from './Contact3D';
import '../styles/Contact.css';

export default function ContactTerminal() {
    const originalEmail = "leandro.graneros@alu.frlp.utn.edu.ar";

    return (
        <section id="contact" className="section contact-section dark-bg">
            <Contact3D />

            <ScrollReveal className="container contact-container">
                <div className="contact-grid">
                    <div className="contact-info-panel">
                        <div className="status-badge">
                            <span className="pulse-dot"></span>
                            SIGNAL_STRENGTH: OPTIMAL // CONTACT_HUB_ONLINE
                        </div>
                        <h2 className="glitch-title" data-text="CONTACT_STATION">CONTACT_STATION</h2>
                        <p className="contact-desc">
                            ¿Listo para colaborar o tienes alguna consulta técnica?
                            Mi terminal de comunicaciones está abierta. Iniciemos un protocolo de colaboración.
                        </p>

                        <div className="social-uplinks">
                            <a href="https://linkedin.com/in/leandro-graneros" target="_blank" rel="noopener noreferrer" className="uplink-node">
                                <div className="uplink-icon"><i className="fa-brands fa-linkedin"></i></div>
                                <div className="uplink-details">
                                    <span className="uplink-label">LINKEDIN_NODE</span>
                                    <span className="uplink-status">ACTIVE_STABLE</span>
                                </div>
                            </a>
                            <a href="https://github.com/leandrosebastiangraneros" target="_blank" rel="noopener noreferrer" className="uplink-node">
                                <div className="uplink-icon"><i className="fa-brands fa-github"></i></div>
                                <div className="uplink-details">
                                    <span className="uplink-label">GITHUB_REPOSITORY</span>
                                    <span className="uplink-status">SYNC_COMPLETE</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="contact-action-panel">
                        <div className="glass-card contact-card">
                            <div className="card-header">
                                <span className="terminal-id">CONTACT_REQ.029</span>
                                <div className="window-controls">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>DIRECT_UPLINK</h3>
                                <p>Canal de fibra óptica securizado. Haz clic en el botón inferior para abrir tu cliente de correo y enviarme un mensaje directo.</p>

                                <div className="action-wrapper">
                                    <a href={`mailto:${originalEmail}`} className="transmission-btn">
                                        <div className="btn-glitch-effect"></div>
                                        <span>ENVIAR_MENSAJE</span>
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </a>
                                </div>

                                <div className="system-logs">
                                    <div className="log-line">&gt; DNS_RESOLUTION... OK</div>
                                    <div className="log-line">&gt; HANDSHAKE_PROTOCOL... OK</div>
                                    <div className="log-line">&gt; READY_FOR_UPLINK...</div>
                                </div>
                            </div>
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
