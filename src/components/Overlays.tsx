import { useState } from 'react';
import { DiaryPage } from './Diary';
import DiaryCard from './DiaryCard';
import Icon from './Icon';
import { PRACTICES, SEV_HINT, SEV_TITLE, Severity, symptomsByFrequency, SYMPTOMS } from '../data';
import { Overlay, useApp } from '../state/AppState';

function Sheet({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label}>
        <div className="sheet__handle" />
        {children}
      </div>
    </>
  );
}

function SeveritySheet({ symptom }: { symptom: Extract<Overlay, { kind: 'severity' }>['symptom'] }) {
  const { draft, setSeverity, close } = useApp();
  const current = draft[symptom];
  const pick = (v: Severity) => {
    setSeverity(symptom, v);
    close();
  };
  const styles: Record<Severity, React.CSSProperties> = {
    L: { background: 'var(--sev-l)' },
    M: { background: 'var(--sev-m)' },
    S: { background: 'var(--sev-s)', color: '#fff' },
  };
  return (
    <Sheet onClose={close} label={`${symptom}: Wie ausgeprägt war es?`}>
      <p className="t-caption c-2" style={{ fontWeight: 600 }}>{symptom}</p>
      <h2 className="t-h2" style={{ margin: '4px 0 16px' }}>Wie ausgeprägt war es?</h2>
      <div className="stack" style={{ gap: 12 }}>
        {(['L', 'M', 'S'] as Severity[]).map((v) => {
          const sel = current === v;
          return (
            <button
              key={v}
              onClick={() => pick(v)}
              aria-pressed={sel}
              style={{ ...styles[v], borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: sel ? 'inset 0 0 0 2px var(--text)' : undefined }}
            >
              <span style={{ flex: 1 }}>
                <span className="t-strong" style={{ display: 'block', fontSize: 17 }}>{SEV_TITLE[v]}</span>
                <span className="t-caption">{SEV_HINT[v]}</span>
              </span>
              {sel && <Icon name="check" />}
            </button>
          );
        })}
      </div>
      {current && (
        <button className="btn btn--text" style={{ color: 'var(--error)', marginTop: 12 }} onClick={() => { setSeverity(symptom, null); close(); }}>
          <Icon name="trash" size={20} /> Symptom entfernen
        </button>
      )}
    </Sheet>
  );
}

function PeriodSheet() {
  const { lastPeriod, setLastPeriod, close } = useApp();
  const iso = `${lastPeriod.getFullYear()}-${String(lastPeriod.getMonth() + 1).padStart(2, '0')}-${String(lastPeriod.getDate()).padStart(2, '0')}`;
  const [value, setValue] = useState(iso);
  return (
    <Sheet onClose={close} label="Letzte Periode">
      <h2 className="t-strong" style={{ fontSize: 18, marginBottom: 12 }}>Wann hat deine letzte Periode begonnen?</h2>
      <label className="t-caption c-2" htmlFor="period-date" style={{ display: 'block', marginBottom: 6 }}>Datum</label>
      <input
        id="period-date"
        type="date"
        value={value}
        max="2026-10-05"
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '100%', height: 52, borderRadius: 12, border: '1.5px solid var(--border-input)', padding: '0 14px', background: '#fff' }}
      />
      <p className="t-caption c-2" style={{ margin: '10px 0 20px' }}>Unregelmäßige Zyklen sind in der Perimenopause häufig.</p>
      <button
        className="btn btn--primary"
        disabled={!value}
        onClick={() => {
          const [y, m, d] = value.split('-').map(Number);
          setLastPeriod(new Date(y, m - 1, d));
          close();
        }}
      >
        Übernehmen
      </button>
      <button className="btn btn--text" style={{ marginTop: 4 }} onClick={close}>Abbrechen</button>
    </Sheet>
  );
}

function DiarySheet({ practiceId }: { practiceId: string }) {
  const { open, close, info } = useApp();
  const p = PRACTICES.find((x) => x.id === practiceId) ?? PRACTICES[0];
  return (
    <Sheet onClose={close} label="Symptomtagebuch">
      <div className="stack" style={{ gap: 24 }}>
        <div>
          <p className="t-overline c-2">6. Sep – 5. Okt 2026</p>
          <h2 className="t-h2">Symptomtagebuch</h2>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <p className="t-body">An <b>12 von 30 Tagen</b> Beschwerden eingetragen, meist <b>mittel bis stark</b>.</p>
          <p className="t-body c-2">
            Nimm diese Übersicht zu deinem Termin mit – ausgedruckt oder auf dem Handy. So sieht deine Ärztin auf einen Blick, wann welche Beschwerden aufgetreten sind und wann deine Periode war.
          </p>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <DiaryCard link="Vorschau ansehen ›" onClick={() => open({ kind: 'fullpdf' })} />
          <div className="hint">
            <Icon name="info" size={20} />
            <span>Das ist keine Diagnose. Es hilft dir, im Gespräch nichts zu vergessen.</span>
          </div>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <button className="btn btn--primary" onClick={() => info('Hier würde das Symptomtagebuch als PDF auf deinem Handy gespeichert.')}>
            <Icon name="download" size={20} /> Als PDF sichern
          </button>
          <div className="stack" style={{ gap: 8 }}>
            <button className="btn btn--secondary" onClick={() => open({ kind: 'send', practiceId: p.id })}>An Praxis senden</button>
            <p className="t-caption c-2" style={{ textAlign: 'center' }}>
              Wenn du schon einen Termin bei {p.name} hast – nur mit deiner Zustimmung.
            </p>
          </div>
        </div>
      </div>
      <button className="btn btn--text" style={{ marginTop: 8 }} onClick={() => {
        if (typeof navigator.share === 'function') navigator.share({ title: 'Symptomtagebuch', text: 'Mein Symptomtagebuch aus Perino (Prototyp)' }).catch(() => undefined);
        else info('Hier würde sich das Teilen-Menü deines Handys öffnen.');
      }}>Anders teilen …</button>
    </Sheet>
  );
}

function PdfSheet() {
  const { open, close, info } = useApp();
  const rows: [string, string][] = [
    ['Beschwerden', 'An 12 von 30 Tagen, meist mittel bis stark'],
    ['Am häufigsten', 'Schlafprobleme 9× · Hitzewallungen 7× · Erschöpfung 5×'],
    ['Letzte Periode', 'Begonnen am 14.09.2026 (3 Tage)'],
  ];
  return (
    <Sheet onClose={close} label="Vorschau Symptomtagebuch">
      <div className="stack" style={{ gap: 24 }}>
        <div>
          <p className="t-overline c-2">Vorschau · 06.09.–05.10.2026</p>
          <h2 className="t-h2">Das steht in deinem PDF</h2>
        </div>
        <div className="card card--tint stack" style={{ gap: 12, padding: 16 }}>
          {rows.map(([l, v]) => (
            <div key={l}>
              <p className="t-caption c-2">{l}</p>
              <p className="t-strong">{v}</p>
            </div>
          ))}
        </div>
        <DiaryCard title="Ganze Seite ansehen" sub="A4 quer · zum Vergrößern im Vollbild öffnen" link="Vollbild ansehen ›" onClick={() => open({ kind: 'fullpdf' })} />
        <div className="stack" style={{ gap: 4 }}>
          <button className="btn btn--primary" onClick={() => info('Hier würde das Symptomtagebuch als PDF auf deinem Handy gespeichert.')}>
            <Icon name="download" size={20} /> Als PDF sichern
          </button>
          <button className="btn btn--text" onClick={close}>Schließen</button>
        </div>
      </div>
    </Sheet>
  );
}

/** PDF im Vollbild: Tippen wechselt zwischen „ganze Seite“ und Originalgröße (zum Verschieben). */
function FullPdf() {
  const { close, info } = useApp();
  const [zoom, setZoom] = useState(false);
  const scale = zoom ? 1 : 358 / 842;
  return (
    <div className="pdf-full" role="dialog" aria-modal="true" aria-label="Symptomtagebuch im Vollbild">
      <div className="pdf-full__bar">
        <button aria-label="Schließen" onClick={close}><Icon name="x" /></button>
        <span className="t-strong">Symptomtagebuch</span>
        <button aria-label="Als PDF sichern" onClick={() => info('Hier würde das Symptomtagebuch als PDF auf deinem Handy gespeichert.')}><Icon name="download" /></button>
      </div>
      <div className={`pdf-full__view${zoom ? ' pdf-full__view--zoom' : ''}`}>
        <button className="pdf-full__page" style={{ width: 842 * scale, height: 595 * scale, marginLeft: zoom ? 0 : 'auto' }} onClick={() => setZoom(!zoom)} aria-label={zoom ? 'Verkleinern' : 'Vergrößern'}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <DiaryPage />
          </div>
        </button>
      </div>
      <p className="pdf-full__hint">{zoom ? 'Wischen zum Verschieben · Tippen zum Verkleinern' : 'Tippen zum Vergrößern · mit zwei Fingern zoomen'}</p>
    </div>
  );
}

/** „+ N weitere“ auf Muster: alle Symptome nach Häufigkeit */
function SymptomsSheet() {
  const { close, patternFilter, setPatternFilter } = useApp();
  const freq = symptomsByFrequency();
  const none = SYMPTOMS.filter((s) => !freq.some((x) => x.s === s));
  const opts: { key: string; label: string; value: typeof patternFilter }[] = [
    { key: 'Alle', label: 'Alle', value: 'Alle' },
    ...freq.map((x) => ({ key: x.s, label: `${x.s} · ${x.n} ${x.n === 1 ? 'Tag' : 'Tage'}`, value: x.s })),
  ];
  return (
    <Sheet onClose={close} label="Symptom wählen">
      <div className="stack" style={{ gap: 24 }}>
        <div>
          <p className="t-overline c-2">Letzte 30 Tage · nach Häufigkeit</p>
          <h2 className="t-h2">Symptom wählen</h2>
        </div>
        <div className="stack" style={{ gap: 8 }} role="radiogroup" aria-label="Symptom">
          {opts.map((o) => {
            const sel = patternFilter === o.value;
            return (
              <button key={o.key} role="radio" aria-checked={sel} className={`option${sel ? ' option--selected' : ''}`} onClick={() => { setPatternFilter(o.value); close(); }}>
                <span className="option__radio" />
                {o.label}
              </button>
            );
          })}
        </div>
        {none.length > 0 && <p className="t-caption c-2">Ohne Einträge in den letzten 30 Tagen: {none.join(', ')}</p>}
      </div>
    </Sheet>
  );
}

function SendSheet({ practiceId }: { practiceId: string }) {
  const { close, info } = useApp();
  const p = PRACTICES.find((x) => x.id === practiceId) ?? PRACTICES[0];
  return (
    <Sheet onClose={close} label="An Praxis senden">
      <h2 className="t-h3" style={{ fontSize: 20, lineHeight: '26px', marginBottom: 10 }}>An {p.practice} senden?</h2>
      <p className="t-body" style={{ marginBottom: 16 }}>
        Die Praxis von {p.name} erhält dein Tagebuch vom 06.09. bis 05.10.2026 als PDF – so ist es vor deinem Termin schon da.
      </p>
      <ul className="hint" style={{ flexDirection: 'column', gap: 8, listStyle: 'none', margin: '0 0 20px' }}>
        {['Nur möglich, wenn du dort einen Termin hast', 'Du entscheidest – nichts wird automatisch geteilt', 'Verschlüsselt übertragen, jederzeit widerrufbar'].map((t) => (
          <li key={t} style={{ display: 'flex', gap: 10 }}>
            <Icon name="check" size={18} color="var(--primary)" />
            {t}
          </li>
        ))}
      </ul>
      <button className="btn btn--primary" onClick={() => info('„An Praxis senden“ gibt es nur im Prototyp. Dafür braucht es eine Anbindung an die Praxis und deine Einwilligung (Gesundheitsdaten).')}>Jetzt senden</button>
      <button className="btn btn--text" style={{ marginTop: 4 }} onClick={close}>Abbrechen</button>
    </Sheet>
  );
}

function InfoDialog({ text, title }: { text: string; title?: string }) {
  const { close } = useApp();
  return (
    <>
      <div className="dialog-scrim" onClick={close} />
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="info-title">
        <p id="info-title" className="t-overline c-primary" style={{ marginBottom: 8 }}>{title ?? 'Nur im Prototyp'}</p>
        <p className="t-body" style={{ marginBottom: 20 }}>{text}</p>
        <button className="btn btn--primary" style={{ minHeight: 48 }} onClick={close} autoFocus>Okay</button>
      </div>
    </>
  );
}

/** Alle Overlays, gestapelt (Bottom Sheets und Hinweis-Dialoge). */
export default function Overlays() {
  const { overlays } = useApp();
  return (
    <>
      {overlays.map((o, i) => {
        const key = `${o.kind}-${i}`;
        switch (o.kind) {
          case 'severity': return <SeveritySheet key={key} symptom={o.symptom} />;
          case 'period': return <PeriodSheet key={key} />;
          case 'diary': return <DiarySheet key={key} practiceId={o.practiceId} />;
          case 'pdf': return <PdfSheet key={key} />;
          case 'fullpdf': return <FullPdf key={key} />;
          case 'symptoms': return <SymptomsSheet key={key} />;
          case 'send': return <SendSheet key={key} practiceId={o.practiceId} />;
          case 'info': return <InfoDialog key={key} text={o.text} title={o.title} />;
        }
      })}
    </>
  );
}

export { DiaryPage };
