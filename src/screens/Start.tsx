import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TabBar from '../components/TabBar';
import { SEV_LABEL, TODAY_LABEL } from '../data';
import { useApp } from '../state/AppState';

export function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/start', { replace: true }), 2000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <button className="splash" onClick={() => navigate('/start', { replace: true })} aria-label="Perino starten">
      <img src="/img/logo.svg" alt="Perino" />
    </button>
  );
}

function StartImage() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div aria-hidden="true" style={{ height: 256, borderRadius: 16, background: 'linear-gradient(160deg, #f3f0fa, #ede9f7)', display: 'grid', placeItems: 'center' }}>
        <img src="/img/gespeichert.svg" alt="" width={180} style={{ opacity: 0.55, filter: 'saturate(.6)' }} />
      </div>
    );
  }
  return <img src="/img/start.jpg" alt="" onError={() => setFailed(true)} style={{ height: 256, width: '100%', objectFit: 'contain', borderRadius: 16 }} />;
}

export default function Start() {
  const navigate = useNavigate();
  const { saved, resetDraft } = useApp();
  const goEntry = () => {
    resetDraft();
    navigate('/eintragen');
  };

  return (
    <>
      <main className="screen screen--padded anim-fade">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 48 }}>
          <p className="t-caption c-2">{TODAY_LABEL}</p>
          <span aria-label="Profil" style={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--surface-subtle)', boxShadow: 'inset 0 0 0 1px var(--border)', fontWeight: 600 }}>C</span>
        </div>
        <p className="t-body-l c-2" style={{ marginTop: 20 }}>Hallo,</p>
        <h1 className="t-h1" style={{ fontSize: 32, lineHeight: '40px' }}>Christina</h1>

        <div style={{ margin: '20px 0 16px' }}>
          <StartImage />
        </div>

        {saved ? (
          <section className="card" aria-label="Heute eingetragen">
            <p className="t-overline c-success">Heute eingetragen</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 8px' }}>
              {saved.symptoms.map((s) => (
                <li key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 0' }}>
                  <span className={`sev-dot sev-dot--${s.severity.toLowerCase()}`} />
                  <span className="t-strong" style={{ flex: 1 }}>{s.name}</span>
                  <span className="t-caption c-2">{SEV_LABEL[s.severity]}</span>
                </li>
              ))}
            </ul>
            <p className="t-body c-2" style={{ marginBottom: 16 }}>Gespeichert um {saved.time} Uhr.</p>
            <button className="btn btn--secondary" onClick={goEntry}>
              <Icon name="plus" size={20} /> Eintrag ergänzen
            </button>
          </section>
        ) : (
          <section className="card card--tint" aria-label="Heute">
            <p className="t-overline c-2">Heute</p>
            <h2 className="t-h2" style={{ marginTop: 4 }}>Noch kein Eintrag</h2>
            <p className="t-body c-2" style={{ margin: '4px 0 18px' }}>Symptome und Periode – dauert weniger als eine Minute.</p>
            <button className="btn btn--primary" onClick={goEntry}>
              <Icon name="plus" size={20} /> Heute eintragen
            </button>
          </section>
        )}
        <div className="tab-space" />
      </main>
      <TabBar />
    </>
  );
}
