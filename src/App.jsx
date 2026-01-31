import { useState, useCallback, useEffect } from 'react';
import StarsBackground from './components/StarsBackground';
import Cursor from './components/Cursor';
import HUD from './components/HUD';
import BootOverlay from './components/BootOverlay';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsDashboard from './components/SkillsDashboard';
import ProjectsVault from './components/ProjectsVault';
import ContactTerminal from './components/ContactTerminal';
import MiniTerminal from './components/MiniTerminal';
import './styles/Footer.css';

function App() {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
    // Add class to body to trigger CSS global animations requiring 'boot-complete' selector
    document.body.classList.add('boot-complete');

    // Clear inline styles if any (like background color set by script)

  }, []);

  return (
    <>
      <Cursor />
      <StarsBackground />
      <HUD visible={bootComplete} />
      <BootOverlay onBootComplete={handleBootComplete} />

      {/* Main Content using Fragment to keep DOM clean */}
      {/* Note: Components have internal checks for visibility or rely on CSS .hidden-element */}

      <HeroSection visible={bootComplete} />

      <main>
        <AboutSection />
        <SkillsDashboard />
        <ProjectsVault />
        <ContactTerminal />
      </main>

      <MiniTerminal />

      <footer className="footer">
        <div className="footer-status">
          <span>SYS.STATUS: STABLE</span>
          <span>UPTIME: 99.9%</span>
        </div>
        <div className="footer-credits">
          DESIGNED_&_BUILT_BY_LEANDRO_GRANEROS © 2026
        </div>
      </footer>
    </>
  );
}

export default App;
