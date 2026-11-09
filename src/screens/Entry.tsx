import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { fmtDate, SEV_LABEL, SYMPTOMS } from '../data';
import { useApp, When } from '../state/AppState';

const WHEN: When[] = ['Heute', 'Gestern', 'Datum wählen'];

export default function Entry() {
  const navigate = useNavigate();
  const { when, setWhen, draft, open, info, note, setNote, save, lastPeriod, periodSetInEntry } = useApp();
  const count = Object.keys(draft).length;

  return (
    <>
      <main className="screen screen--padded anim-up" aria-labelledby="entry-title">
        <button aria-label="Schließen" onClick={() => navigate(-1)} style={{ marginTop: 36, width: 44, height: 44, marginLeft: -10, display: 'grid', placeItems: 'center' }}>
          <Icon name="x" />
        </button>
        <h1 id="entry-title" className="t-h1" style={{ marginTop: 2 }}>Symptom eintragen</h1>

        <h2 className="t-h3" style={{ margin: '12px 0 10px', fontWeight: 700, fontSize: 19 }}>Wann?</h2>
        <div className="chip-row" role="radiogroup" aria-label="Wann?">
          {WHEN.map((w) => {
            const sel = when === w;
            return (
              <button
                key={w}
                role="radio"
                aria-checked={sel}
                className={`chip${sel ? ' chip--selected' : ''}`}
                onClick={() => (w === 'Datum wählen' ? info('Ein anderes Datum wählst du hier über einen Kalender. Im Prototyp trägst du für heute oder gestern ein.') : setWhen(w))}
              >
                {sel && <Icon name="check" size={16} stroke={2.2} />}
                {w}
              </button>
            );
          })}
        </div>

        <h2 className="t-h3" style={{ margin: '20px 0 10px', fontWeight: 700, fontSize: 19 }}>Was hast du bemerkt?</h2>
        <div className="chip-row">
          {SYMPTOMS.map((s) => {
            const sev = draft[s];
            return (
              <button
                key={s}
                className={`chip${sev ? ' chip--selected' : ''}`}
                aria-pressed={!!sev}
                aria-label={sev ? `${s}, ${SEV_LABEL[sev]}` : s}
                onClick={() => open({ kind: 'severity', symptom: s })}
              >
                {sev && <span className={`sev-dot sev-dot--${sev.toLowerCase()}`} />}
                {s}
                {sev && <span style={{ fontWeight: 500 }}>· {SEV_LABEL[sev]}</span>}
              </button>
            );
          })}
          <button className="chip chip--add" onClick={() => info('Hier könntest du ein eigenes Symptom ergänzen, zum Beispiel „Kopfschmerzen“.')}>
            + Anderes
          </button>
        </div>

        <button
          onClick={() => open({ kind: 'period' })}
          style={{ marginTop: 20, width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '0 14px 0 16px', borderRadius: 12, background: 'var(--tint)' }}
        >
          <Icon name="calendar" size={20} color="var(--primary)" />
          <span className="t-strong" style={{ flex: 1 }}>{periodSetInEntry ? `Letzte Periode: ${fmtDate(lastPeriod)}` : 'Letzte Periode eintragen'}</span>
          {periodSetInEntry ? <Icon name="check" size={18} color="var(--primary)" /> : <span className="t-caption c-2">optional</span>}
          <Icon name="chevronRight" size={20} />
        </button>

        <label htmlFor="note" style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '24px 0 8px' }}>
          <span className="t-h3" style={{ fontWeight: 700, fontSize: 19 }}>Notiz</span>
          <span className="t-caption c-2">optional</span>
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          placeholder="z. B. nachts zweimal aufgewacht"
          rows={2}
          style={{ width: '100%', minHeight: 52, padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border-input)', resize: 'none' }}
        />
        <div style={{ height: 130 }} />
      </main>

      <div className="fixed-cta" style={{ bottom: 34 }}>
        <button
          className="btn btn--primary"
          disabled={count === 0}
          onClick={() => {
            save();
            navigate('/gespeichert', { replace: true });
          }}
        >
          {count > 1 ? `Eintrag speichern (${count})` : 'Eintrag speichern'}
        </button>
      </div>
    </>
  );
}
