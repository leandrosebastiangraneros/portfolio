import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import StarsBackground from './components/StarsBackground';
import Cursor from './components/Cursor';
import HUD from './components/HUD';
import BootOverlay from './components/BootOverlay';
import HeroSection from './components/HeroSection';
import './styles/Footer.css';

// Lazy Load heavy components to optimize initial bundle
const AboutSection = lazy(() => import('./components/AboutSection'));
const SkillsDashboard = lazy(() => import('./components/SkillsDashboard'));
const ProjectsVault = lazy(() => import('./components/ProjectsVault'));
const ContactTerminal = lazy(() => import('./components/ContactTerminal'));
const MiniTerminal = lazy(() => import('./components/MiniTerminal'));

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
  }, []);

  return (
    <>
      <Cursor />
      <StarsBackground />
      <HUD visible={bootComplete} />
      <BootOverlay onBootComplete={handleBootComplete} />

      {/* Critical Path Content */}
      <HeroSection visible={bootComplete} />

      {/* Deferred Content */}
      <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
        <main>
          <AboutSection />
          <SkillsDashboard />
          <ProjectsVault />
          <ContactTerminal />
        </main>
        <MiniTerminal />
      </Suspense>

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
