import { Navigate, useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { SEV_LABEL, TODAY_LABEL } from '../data';
import { useApp } from '../state/AppState';

export default function Saved() {
  const navigate = useNavigate();
  const { saved } = useApp();
  if (!saved) return <Navigate to="/start" replace />;
  const dayLabel = saved.when === 'Gestern' ? 'So, 4. Oktober' : TODAY_LABEL;

  return (
    <>
      <main className="screen screen--padded anim-fade" style={{ textAlign: 'center' }}>
        <img src="/img/gespeichert.svg" alt="" width={146} height={112} style={{ margin: '120px auto 20px' }} />
        <h1 className="t-h1">Gespeichert!</h1>
        <p className="t-body-l c-2" style={{ margin: '8px 0 20px' }}>Danke, dass du dir die Zeit genommen hast. Mit jedem Eintrag wird dein Muster genauer.</p>

        <section className="card" style={{ textAlign: 'left' }} aria-label="Dein Eintrag">
          <p className="t-overline c-2">Dein Eintrag · {dayLabel}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 14px', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
            {saved.symptoms.map((s) => (
              <li key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3px 0' }}>
                <span className="t-body" style={{ flex: 1 }}>{s.name}</span>
                <span className={`sev-dot sev-dot--${s.severity.toLowerCase()}`} />
                <span className="t-caption" style={{ fontWeight: 600, width: 50 }}>{SEV_LABEL[s.severity].replace(/^./, (c) => c.toUpperCase())}</span>
              </li>
            ))}
          </ul>
          <p className="t-caption c-2">5 von 7 Tagen diese Woche eingetragen</p>
          <div className="bar" style={{ marginTop: 8 }} role="progressbar" aria-valuenow={5} aria-valuemin={0} aria-valuemax={7}>
            <span style={{ width: `${(5 / 7) * 100}%` }} />
          </div>
        </section>

        <div className="stack" style={{ gap: 8, marginTop: 28 }}>
          <button className="btn btn--primary" onClick={() => navigate('/muster')}>Dein Muster ansehen</button>
          <button className="btn btn--text" onClick={() => navigate('/start')}>Zur Startseite</button>
        </div>
        <div className="tab-space" />
      </main>
      <TabBar />
    </>
  );
}
