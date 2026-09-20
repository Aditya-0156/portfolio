import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.DEV) {
  Promise.all([
    import('./lib/copyFit.js'),
    import('./content/site.js'),
    import('./content/hero.js'),
    import('./content/now.js'),
    import('./content/work.js'),
    import('./content/projects.js'),
    import('./content/research.js'),
    import('./content/stack.js'),
    import('./content/education.js'),
    import('./content/contact.js'),
    import('./content/spectrum.js'),
  ]).then(([{ runCopyFit }, site, hero, now, work, projects, research, stack, education, contact, spectrum]) => {
    runCopyFit({
      site: site.default,
      hero: hero.default,
      now: now.default,
      work: work.default,
      projects: projects.default,
      research: research.default,
      stack: stack.default,
      education: education.default,
      contact: contact.default,
      spectrum: spectrum.default,
    });
  });
}
