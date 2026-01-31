import Globe3D from './Globe3D';
import '../styles/Hero.css';

export default function HeroSection({ visible }) {
    return (
        <section id="hero" className="hero-section">
            <Globe3D />
            <div className={`hero-content hidden-element ${visible ? 'show-element' : ''}`}>
                <p className="subtitle">Hola, soy</p>
                <h1 className="title">LEANDRO<br />
                    SEBASTIAN<br />
                    GRANEROS</h1>
                <p className="role">IT SPECIALIST & WEB DEVELOPER</p>
            </div>
        </section>
    );
}
