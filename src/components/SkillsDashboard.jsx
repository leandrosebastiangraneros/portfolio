import ScrollReveal from './ScrollReveal';
import '../styles/Skills.css';

export default function SkillsDashboard() {
    return (
        <section id="skills" className="section dark-bg">
            <ScrollReveal className="container">
                <h2 className="section-title">HABILIDADES</h2>
                <div className="skills-dashboard">

                    {/* Fila 1: Frontend (8) + Design (4) */}

                    {/* MOD_01: Frontend Core */}
                    <div className="skill-module wide">
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="projection-icon" alt="React" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" className="projection-icon" alt="JS" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" className="projection-icon" alt="ThreeJS" />
                        </div>

                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_01</span>
                                    <span className="module-status">[DOM_ACTIVE]</span>
                                </div>
                                <h3>Desarrollo Frontend</h3>
                                <p>React 19, TailwindCSS 4, React Router 7, Vite 7, Recharts & Three.js. Arquitectura de componentes modernos.</p>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '95%' }}></div>
                                </div>
                                <p className="font-mono" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                    JS (ES6+), HTML5, CSS3
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* MOD_02: UX/UI Design */}
                    <div className="skill-module narrow">
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" className="projection-icon" alt="PS" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" className="projection-icon" alt="Figma" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_02</span>
                                    <span className="module-status">[RENDER_OK]</span>
                                </div>
                                <h3>Diseño UI/UX</h3>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '90%' }}></div>
                                </div>
                                <p>Adobe Photoshop (Avanzado), Figma, Animaciones CSS y Diseño Responsivo.</p>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: Backend (4) + Tools (4) + Specialist (4) */}

                    {/* MOD_03: Backend Engineering */}
                    <div className="skill-module narrow">
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" className="projection-icon" alt="Python" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" className="projection-icon" alt="FastAPI" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_03</span>
                                    <span className="module-status">[API_READY]</span>
                                </div>
                                <h3>Ingeniería Backend</h3>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '85%' }}></div>
                                </div>
                                <p style={{ fontSize: '0.8rem' }}>FastAPI, Pydantic, SQLAlchemy, C (ctypes), SQL, Seguridad API.</p>
                            </div>
                        </div>
                    </div>

                    {/* MOD_04: Dev Tools */}
                    <div className="skill-module narrow">
                        <div className="hologram-projection">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" className="projection-icon" alt="Git" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" className="projection-icon" alt="VSCode" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_04</span>
                                    <span className="module-status">[DEPLOYED]</span>
                                </div>
                                <h3>Herramientas</h3>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '88%' }}></div>
                                </div>
                                <p style={{ fontSize: '0.8rem' }}>Git/GitHub, Vercel, Render, Postman, Microsoft 365.</p>
                            </div>
                        </div>
                    </div>

                    {/* MOD_05: Specialist Ops */}
                    <div className="skill-module narrow">
                        <div className="hologram-projection">
                            <img src="https://img.icons8.com/color/144/microsoft-excel-2019--v1.png" className="projection-icon" alt="Excel" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" className="projection-icon" alt="Win" />
                        </div>
                        <div className="module-inner">
                            <div className="module-content">
                                <div className="module-meta">
                                    <span className="module-id">MOD_05</span>
                                    <span className="module-status">[SYS_ADMIN]</span>
                                </div>
                                <h3>Soporte IT</h3>
                                <div className="progress-container">
                                    <div className="progress-bar-segment" style={{ '--target-width': '92%' }}></div>
                                </div>
                                <p style={{ fontSize: '0.8rem' }}>Excel (Expert/VBA), Diagnóstico Hardware/Software, Redes LAN/WLAN.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </ScrollReveal>
        </section>
    );
}
