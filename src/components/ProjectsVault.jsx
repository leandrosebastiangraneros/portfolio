import { useRef, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import { projects } from '../data/projectsData';
import '../styles/Projects.css';
import '../styles/Skills.css';

export default function ProjectsVault() {
    const vaultRef = useRef(null);
    const dragData = useRef({ isDown: false, startX: 0, scrollLeft: 0, hasMoved: false });

    // Prefix for multi-site deployment compatibility (GitHub vs Vercel)
    const basePrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

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
                    <h2 className="section-title">PROYECTOS</h2>
                </div>

                <div className="projects-vault" ref={vaultRef}>
                    {projects.map((project, index) => {
                        const href = project.link.startsWith('/') ? `${basePrefix}${project.link}` : project.link;

                        return (
                            <a
                                key={index}
                                href={href}
                                className="vault-item skill-module vault-item-link"
                                draggable="false"
                                onClick={project.isPreventDefault ? (e) => e.preventDefault() : undefined}
                                target={project.target}
                                rel={project.target ? "noopener noreferrer" : undefined}
                            >
                                <div className="hologram-projection">
                                    <i className={`${project.icons.main} projection-icon project-icon-large`} style={{ color: '#ffffff' }}></i>
                                    <i className={`${project.icons.secondary} projection-icon project-icon-large`} style={{ color: '#ffffff', animationDelay: '0.5s' }}></i>
                                </div>
                                <div className="module-inner">
                                    <div className="module-content">
                                        <div className="module-meta">
                                            <span className="module-id">{project.id}</span>
                                            <span className="module-status">{project.status}</span>
                                        </div>
                                        <h3 className="project-title">{project.title}</h3>
                                        <div className="progress-container project-progress-container">
                                            <div className="progress-bar-segment" style={{ '--target-width': '100%' }}></div>
                                        </div>
                                        <p className="project-desc">{project.description}</p>

                                        <div className="tech-stack project-stack">
                                            {project.techStack.map((tech, i) => (
                                                <i key={i} className={tech.icon} title={tech.name}></i>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </ScrollReveal>
        </section>
    );
}
