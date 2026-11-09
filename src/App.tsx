import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Overlays from './components/Overlays';
import Entry from './screens/Entry';
import Pattern from './screens/Pattern';
import Practices from './screens/Practices';
import Profile from './screens/Profile';
import Saved from './screens/Saved';
import Start, { Splash } from './screens/Start';
import { AppStateProvider, useApp } from './state/AppState';

function Phone() {
  const { pathname } = useLocation();
  const { closeAll } = useApp();
  // Overlays schließen, wenn der Screen wechselt
  useEffect(() => closeAll(), [pathname, closeAll]);
  return (
    <div className="phone">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/start" element={<Start />} />
        <Route path="/eintragen" element={<Entry />} />
        <Route path="/gespeichert" element={<Saved />} />
        <Route path="/muster" element={<Pattern />} />
        <Route path="/fachpraxen" element={<Practices />} />
        <Route path="/fachpraxis/:id" element={<Profile />} />
        <Route path="*" element={<Navigate to="/start" replace />} />
      </Routes>
      <Overlays />
    </div>
  );
}

function DevPanel() {
  const { resetAll } = useApp();
  const navigate = useNavigate();
  return (
    <aside className="dev" aria-label="Prototyp-Navigation">
      <h2>Perino · Hi-Fi-Prototyp</h2>
      <p>Klickbarer Flow wie im Usability-Test: vom Eintrag zur Fachpraxis.</p>
      <hr />
      <Link to="/">00 Splash</Link>
      <Link to="/start">01 Start</Link>
      <Link to="/eintragen">02 Symptom eintragen</Link>
      <Link to="/muster">06 Dein Muster</Link>
      <Link to="/fachpraxen">07 Fachpraxen</Link>
      <Link to="/fachpraxis/berger">08 Profil · Dr. Berger</Link>
      <hr />
      <button
        onClick={() => {
          resetAll();
          navigate('/');
        }}
      >
        ↺ Prototyp zurücksetzen
      </button>
      <p style={{ fontSize: 12 }}>Stand: Hi Fi, 9. November 2026</p>
    </aside>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <div className="stage">
        <Phone />
        <DevPanel />
      </div>
    </AppStateProvider>
  );
}
