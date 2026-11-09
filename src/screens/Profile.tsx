import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DiaryThumb } from '../components/Diary';
import Icon, { IconName } from '../components/Icon';
import Photo from '../components/Photo';
import TabBar from '../components/TabBar';
import { MATCHING, PRACTICES } from '../data';
import { useApp } from '../state/AppState';
import { FocusChips } from './Practices';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open, info } = useApp();
  const p = PRACTICES.find((x) => x.id === id);
  if (!p) return <Navigate to="/fachpraxen" replace />;
  const matches = p.focus.some((f) => MATCHING.includes(f));

  const praxis: [IconName, string][] = [
    ['pin', `${p.address}\n${p.distance}`],
    ['walk', p.walk],
    ['shield', `${p.insurance.replace(' · auch online', '')}${p.newPatients ? ' · nimmt neue Patientinnen' : ''}`],
    ['check', 'Barrierefreier Zugang'],
  ];

  return (
    <>
      <main className="screen anim-push" aria-labelledby="pf-title">
        <header style={{ position: 'relative', background: 'var(--tint)', height: 268, textAlign: 'center', paddingTop: 52 }}>
          <button aria-label="Zurück" onClick={() => navigate(-1)} style={{ position: 'absolute', left: 10, top: 48, width: 44, height: 44, display: 'grid', placeItems: 'center' }}>
            <Icon name="arrowLeft" />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Photo src={p.photo} initials={p.initials} size={88} ring />
          </div>
          <h1 id="pf-title" className="t-h1" style={{ fontSize: 24, lineHeight: '30px', marginTop: 10 }}>{p.name}</h1>
          <p className="t-caption" style={{ fontWeight: 600 }}>{p.role} · {p.practice}</p>
          <p className="t-caption c-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Icon name="check" size={16} color="var(--primary)" /> Fortbildung Perimenopause geprüft
          </p>
        </header>
        <div style={{ padding: '0 20px' }}>
          <button className="btn btn--primary" style={{ marginTop: -28, position: 'relative' }} onClick={() => info('Hier würde sich die Website der Praxis öffnen (außerhalb von Perino). Dort vereinbarst du deinen Termin.')}>
            Zur Website der Praxis <Icon name="external" size={20} />
          </button>
          <p className="t-caption c-2" style={{ textAlign: 'center', margin: '10px 16px 20px' }}>Einen Termin vereinbarst du direkt über die Website der Praxis.</p>

          <section className="card" aria-label="Praxis">
            <h2 className="t-h2" style={{ marginBottom: 14 }}>Praxis</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
              {praxis.map(([icon, text]) => (
                <li key={text} style={{ display: 'flex', gap: 12, whiteSpace: 'pre-line' }} className="t-caption">
                  <Icon name={icon} size={20} />
                  <span style={{ fontSize: 15 }}>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" style={{ marginTop: 16 }} aria-label="Warum diese Ärztin?">
            <h2 className="t-h2" style={{ marginBottom: 14 }}>Warum diese Ärztin?</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
              {['Fortbildung „Perimenopause in der Praxis“ · 40 Stunden · abgeschlossen 2025', 'Behandelt Beschwerden in der Perimenopause', 'Nachweis zuletzt geprüft: September 2026'].map((t) => (
                <li key={t} style={{ display: 'flex', gap: 12 }}>
                  <Icon name="check" size={20} />
                  <span style={{ fontSize: 15, lineHeight: '22px' }}>{t}</span>
                </li>
              ))}
            </ul>
            <p className="t-strong" style={{ fontWeight: 700, margin: '18px 0 8px' }}>Schwerpunkte</p>
            <FocusChips focus={p.focus} />
            {matches && <p className="t-caption c-2" style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="check" size={14} /> Passt zu deinem Muster</p>}
            <button className="link" style={{ marginTop: 14, minHeight: 32 }} onClick={() => info('Wir prüfen bei jeder Praxis den Nachweis einer Fortbildung zur Perimenopause und wiederholen die Prüfung regelmäßig.', 'So prüfen wir')}>
              So prüfen wir
            </button>
          </section>

          <button className="card card--primary" onClick={() => open({ kind: 'diary', practiceId: p.id })} style={{ display: 'flex', gap: 14, alignItems: 'center', width: '100%', padding: 12, marginTop: 16 }}>
            <DiaryThumb width={124} />
            <span>
              <span className="t-strong" style={{ display: 'block', fontSize: 17 }}>Symptomtagebuch</span>
              <span className="t-caption" style={{ display: 'block', opacity: 0.85 }}>PDF für deinen Arzttermin · A4 · letzte 30 Tage</span>
              <span className="t-caption" style={{ fontWeight: 700 }}>Ansehen &amp; sichern ›</span>
            </span>
          </button>
        </div>
        <div className="tab-space" />
      </main>
      <TabBar />
    </>
  );
}
