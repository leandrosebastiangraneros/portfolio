import ScrollReveal from './ScrollReveal';
import '../styles/Skills.css';

export default function SkillsDashboard() {
    return (
        <section id="skills" className="section dark-bg">
            <ScrollReveal className="container">
                <h2 className="section-title inverted">CORE_MODULES</h2>
                <div className="skills-dashboard">

                    {/* MOD_01: Developer Core */}
                    <div className="skill-module wide">
                        {/* Capa Externa: Hologramas (Sin recorte) */}
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" className="projection-icon" alt="JS" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="projection-icon" alt="React" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" className="projection-icon" alt="Python" />
                        </div>

                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_01</span>
                                    <span className="module-status">[RUNNING_STABLE]</span>
                                </div>
                                <h3>Developer_Core</h3>
                                <p>Dominio de arquitecturas modernas y lenguajes fundamentales para el desarrollo escalable.</p>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '95%' }}></div>
                                </div>
                                <p className="font-mono" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                    JS, React.exe, Python.core, SQL_Engine, C++, Assembler
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* MOD_02: UI Design */}
                    <div className="skill-module narrow">
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" className="projection-icon" alt="PS" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" className="projection-icon" alt="Figma" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_02</span>
                                    <span className="module-status">[OPTIMIZED]</span>
                                </div>
                                <h3>UI_Design</h3>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '85%' }}></div>
                                </div>
                                <p>Adobe_PS, Figma, Canva, UX_Architecture</p>
                            </div>
                        </div>
                    </div>

                    {/* MOD_03: Support & Systems */}
                    <div className="skill-module medium">
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" className="projection-icon" alt="Windows" />
                            <img src="https://img.icons8.com/ios-filled/100/00f0ff/ethernet-off.png" className="projection-icon" alt="Networks" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_03</span>
                                    <span className="module-status">[ACTIVE_SYNC]</span>
                                </div>
                                <h3>Systems_Admin</h3>
                                <p>Gestión de infraestructura, diagnóstico de hardware avanzado y redes LAN/WLAN.</p>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '90%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MOD_04: Automation & Productivity */}
                    <div className="skill-module medium">
                        <div className="hologram-projection">
                            <img src="https://img.icons8.com/color/144/microsoft-excel-2019--v1.png" className="projection-icon" alt="Excel" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_04</span>
                                    <span className="module-status">[LOADED]</span>
                                </div>
                                <h3>Automation_Office</h3>
                                <p>Excel Avanzado (VBA/Macros), automatización de procesos y gestión de tickets corporativos.</p>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '95%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </ScrollReveal>
        </section>
    );
}
