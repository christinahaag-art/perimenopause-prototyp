import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Kopf from '../components/Kopf';
import TabBar from '../components/TabBar';
import { DAYS, fmtDay, maxSeverity, SEV_LABEL, SEV_RANK, SEV_TITLE, Severity, TODAY_LABEL, WEEKDAYS_LONG } from '../data';
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

// Letzte 7 Tage: Di 29.9. – Mo 5.10. (heute)
const WEEK = DAYS.slice(-7);

export default function Start() {
  const navigate = useNavigate();
  const { saved, resetDraft } = useApp();
  const goEntry = () => {
    resetDraft();
    navigate('/eintragen');
  };
  const todaySev = saved ? saved.symptoms.reduce<Severity | undefined>((best, x) => (!best || SEV_RANK[x.severity] > SEV_RANK[best] ? x.severity : best), undefined) : undefined;
  const entries = WEEK.filter((d, i) => (i === 6 ? !!todaySev : !!maxSeverity(d, 'Alle'))).length;

  return (
    <>
      <main className="screen anim-fade">
        <Kopf overline={TODAY_LABEL} title="Hallo, Sandra" illustration="start" profile />
        <div className="below-kopf sections">
          <section className="section" aria-label="Deine Woche">
            <div className="section__head">
              <h2 className="t-h3">Deine Woche</h2>
              <span className="t-caption c-2">{entries} Einträge</span>
            </div>
            <div className="week">
              {WEEK.map((d, i) => {
                const isToday = i === 6;
                const s = isToday ? todaySev : maxSeverity(d, 'Alle');
                return (
                  <div key={d.date.toISOString()} className="week__day">
                    <span className="week__label">{WEEKDAYS_LONG[d.date.getDay()]}</span>
                    <span className={`cal__cell${s ? ` cal__cell--${s.toLowerCase()}` : ''}${isToday ? ' cal__cell--today' : ''}`} aria-label={`${fmtDay(d.date)}${s ? `, ${SEV_LABEL[s]}` : ', kein Eintrag'}`}>
                      {s && <span className={`cal__pill cal__pill--${s.toLowerCase()}`} />}
                      <span className="cal__num">{d.date.getDate()}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <button className="row-card" onClick={() => navigate('/muster')}>
            <span style={{ flex: 1 }}>
              <span className="t-overline c-2" style={{ display: 'block' }}>Dein Muster</span>
              <span className="t-strong" style={{ display: 'block' }}>Schlafprobleme an 9 von 28 Tagen</span>
            </span>
            <Icon name="chevronRight" size={20} color="var(--primary)" />
          </button>

          <section className="section" aria-label="Heute">
            <h2 className="t-h3">Heute</h2>
            {saved ? (
              <div className="card stack" style={{ gap: 20 }}>
                <div className="stack" style={{ gap: 8 }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {saved.symptoms.map((s) => (
                      <li key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 0' }}>
                        <span className="t-body c-2" style={{ flex: 1 }}>{s.name}</span>
                        <span className={`sev-dot sev-dot--${s.severity.toLowerCase()}`} />
                        <span className="t-strong">{SEV_TITLE[s.severity]}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="t-body c-2" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="check" size={18} color="var(--primary)" /> Gespeichert um {saved.time} Uhr
                  </p>
                </div>
                <button className="btn btn--secondary" onClick={goEntry}>
                  <Icon name="plus" size={20} /> Eintrag ergänzen
                </button>
              </div>
            ) : (
              <div className="card stack" style={{ gap: 20 }}>
                <div className="stack" style={{ gap: 4 }}>
                  <p className="t-strong">Noch kein Eintrag</p>
                  <p className="t-body c-2">Symptome und Periode – dauert weniger als eine Minute.</p>
                </div>
                <button className="btn btn--primary" onClick={goEntry}>
                  <Icon name="plus" size={20} /> Heute eintragen
                </button>
              </div>
            )}
          </section>
        </div>
        <div className="tab-space" />
      </main>
      <TabBar />
    </>
  );
}
